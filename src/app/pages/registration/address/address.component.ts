import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Subject,
  distinctUntilChanged,
  map,
  merge,
  scan,
  takeUntil,
} from 'rxjs';
import {
  Address,
  GetAddressService,
} from 'src/app/pages/registration/address/get-address.service';
import { RegistrationService } from 'src/app/pages/registration/registration.service';

@Pipe({
  name: 'formatAddress',
  standalone: true,
})
export class FormatAddressPipe implements PipeTransform {
  transform(address: Address): string {
    return address.filter((addressComponent) => addressComponent).toString();
  }
}

@Component({
  selector: 'mipools-front-end-address',
  standalone: true,
  imports: [
    CommonModule,
    FormatAddressPipe,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public registrationService = inject(RegistrationService);
  public getAddressService = inject(GetAddressService);
  public addressIndexFormControl = new FormControl<number | null>(null);
  public selectedAddress$ = merge(
    this.getAddressService.addresses$,
    this.addressIndexFormControl.valueChanges,
  ).pipe(
    scan(
      (state: SelectedAddressState, stream) => {
        if (typeof stream === 'number') {
          state.selected = state.addresses.at(stream) || null;
        } else if (stream === null) {
          state.selected = null;
        } else {
          state.addresses = stream;
        }
        return state;
      },
      {
        addresses: [],
        selected: null,
      },
    ),
    map((state) => state.selected),
    distinctUntilChanged(),
  );

  ngOnInit(): void {
    this.selectedAddress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedAddress) => {
        const updateAddressForm = selectedAddress
          ? {
              address1: selectedAddress[0],
              address2: selectedAddress[1],
              city: selectedAddress[2],
            }
          : {
              address1: '',
              address2: '',
              city: '',
            };
        this.registrationService.addressForm.patchValue(updateAddressForm);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}

interface SelectedAddressState {
  addresses: Address[];
  selected: Address | null;
}
