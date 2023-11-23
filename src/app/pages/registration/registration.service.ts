import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { sub } from 'date-fns';
import { BehaviorSubject, map } from 'rxjs';
import { MiddlewareStatusCode } from 'src/app/core/models/middleware-response.interface';
import { AuthenticatorRedirectService } from 'src/app/core/services/system/authenticator-redirect.service';
import { DialogService } from 'src/app/core/services/system/dialog.service';
import {
  MiddlewareError,
  MiddlewareRequestService,
} from 'src/app/core/services/system/middleware-request.service';
import { assertUnreachable } from 'src/app/lib/assert-unreachable';
import { beforeDateValidate } from 'src/app/lib/before-date-validator';
import { controlMatchValidator } from 'src/app/lib/control-match-validator';
import { passwordValidator } from 'src/app/lib/password-validator';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly router = inject(Router);
  private readonly middlewareRequestService = inject(MiddlewareRequestService);
  private readonly dialogService = inject(DialogService);
  private readonly authenticatorRedirectService = inject(
    AuthenticatorRedirectService,
  );

  private _registrationStage$ = new BehaviorSubject<RegistrationStage>(0);

  public readonly stage$ = this._registrationStage$.asObservable();
  public readonly title$ = this.stage$.pipe(
    map((stage) => {
      switch (stage) {
        case 0:
          return 'Your Details';
        case 1:
          return 'Verify Email';
        case 2:
          return 'Your Address';
        case 3:
          return 'Your Account';
        case 4:
          return 'Join The Fun';
        case 5:
          return 'Verification Required';
        default:
          throw assertUnreachable(stage);
      }
    }),
  );

  public readonly detailsForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dateOfBirth: new FormControl<Date | null>(null, {
      nonNullable: false,
      validators: [
        Validators.required,
        beforeDateValidate(sub(new Date(), { years: 18 })),
      ],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  public readonly verificationForm = new FormGroup({
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\d\d\d\d\d\d/)
      ],
    }),
  });

  public readonly addressForm = new FormGroup({
    mobile: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\d\d\d\d\d\d\d\d\d\d\d/),
      ],
    }),
    postcode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address1: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address2: new FormControl<string>('', {
      nonNullable: true,
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private readonly password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, passwordValidator()],
  });

  private readonly passwordCheck = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, controlMatchValidator(this.password)],
  });

  public readonly accountForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: this.password,
    passwordCheck: this.passwordCheck,
    overEighteen: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    optIn: new FormControl<boolean>(false, { nonNullable: true }),
  });

  public submitPlayerDetails(): void {
    if (!this.detailsForm.valid) return;
    const form = this.detailsForm.getRawValue();
    this.dialogService.openLoader();
    if (form.dateOfBirth === null) {
      return;
    }
    this.middlewareRequestService
      .post<null>(environment.api.middleware.regOne, {
        Title: form.title,
        FirstName: form.firstName,
        LastName: form.lastName,
        DOB: form.dateOfBirth.getDate().toString(),
        MOB: (form.dateOfBirth.getMonth() + 1).toString(),
        YOB: form.dateOfBirth.getFullYear().toString(),
        Email: form.email,
      })
      .subscribe((res) =>
        this.handleRegistrationResponse(res, RegistrationStage.verify),
      );
  }

  public submitVerificationCode(): void {
    if (!this.verificationForm.valid || !this.detailsForm.valid) return;
    this.dialogService.openLoader();
    this.middlewareRequestService
      .post<null>(environment.api.middleware.validateRegistrationCode, {
        ValidationCode: this.verificationForm.controls.code.value,
        Email: this.detailsForm.controls.email.value,
      })
      .subscribe((res) =>
        this.handleRegistrationResponse(res, RegistrationStage.address),
      );
  }

  /**
   * does not actually submit anything, address is submitted under {@link submitAccount}
   */
  public submitAddress(): void {
    if (!this.addressForm.valid) return;
    this.navigateToRegistrationStage(RegistrationStage.account);
  }

  public submitAccount(): void {
    // TODO affiliate code + referrer
    if (!this.detailsForm || !this.addressForm.valid || !this.accountForm.valid)
      return;
    const [address, account] = [
      this.addressForm.getRawValue(),
      this.accountForm.getRawValue(),
    ];
    this.dialogService.openLoader();

    this.middlewareRequestService
      .post<null>(environment.api.middleware.regTwo, {
        Mobile: address.mobile,
        PostalCode: address.postcode,
        City: address.city,
        Address1: address.address1,
        Address2: address.address2,
        Username: account.username,
        Password: account.password,
        Email: this.detailsForm.controls.email.value,
        OptIn: account.optIn ? '1' : '0',
      })
      .subscribe((res) =>
        this.handleRegistrationResponse(res, RegistrationStage.successful),
      );
  }

  public reset(): void {
    this.detailsForm.reset();
    this.verificationForm.reset();
    this.addressForm.reset();
    this.accountForm.reset();
    this._registrationStage$.next(RegistrationStage.details);
  }

  public back(): void {
    this._registrationStage$.next(this._registrationStage$.value - 1);
  }

  private handleRegistrationResponse(
    res: null | MiddlewareError | Error,
    nextStage: RegistrationStage,
  ): void {
    this.dialogService.closeAllDialogs();
    if (res instanceof MiddlewareError) {
      switch (res.status) {
        case MiddlewareStatusCode.validationCodesCloseToLimit:
          this.navigateToRegistrationStage(RegistrationStage.verify);
          break;
        case MiddlewareStatusCode.noMatch:
          this.navigateToRegistrationStage(RegistrationStage.unsuccessful, {
            status: res.status,
          });
          break;
        case MiddlewareStatusCode.truliooFailed:
          this.navigateToRegistrationStage(RegistrationStage.unsuccessful, {
            status: res.status,
          });
          break;
        case MiddlewareStatusCode.truliooSucceeded:
          this.authenticatorRedirectService.redirectToLogin('/account');
          break;
        default:
          this.dialogService.openErrorDialog();
      }
    } else if (res instanceof Error) {
      this.dialogService.openErrorDialog();
    } else {
      this.navigateToRegistrationStage(nextStage);
    }
  }

  private navigateToRegistrationStage(
    registrationStage: RegistrationStage,
    queryParams?: Params,
  ) {
    this._registrationStage$.next(registrationStage);
    this.router.navigate(
      ['registration', RegistrationStage[registrationStage]],
      { queryParams },
    );
  }
}

export enum RegistrationStage {
  'details',
  'verify',
  'address',
  'account',
  'successful',
  'unsuccessful',
}
