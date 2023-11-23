import { Injectable } from '@angular/core';
import { Subject, map, merge, scan, shareReplay, startWith, tap } from 'rxjs';
import {
  StorageItem,
  StorageService,
} from 'src/app/core/services/system/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AnswersService {
  private putAnswer$ = new Subject<Answer>();

  private clearAnswers$ = new Subject<void>();

  private answerMap$ = merge(
    this.putAnswer$.pipe(
      map((answer): ['put', typeof answer] => ['put', answer]),
    ),
    this.clearAnswers$.pipe(map((): ['clear', null] => ['clear', null])),
  ).pipe(
    scan((state: AnswerMap, stream) => {
      if (stream[0] === 'clear') {
        state = new Map();
      } else if (stream[0] === 'put') {
        state = putAnswerInMap(state, stream[1]);
      }
      return state;
    }, this.getMapFromStorage()),
    tap((answerMap) => this.storeMapInStorage(answerMap)),
    startWith(this.getMapFromStorage()),
    shareReplay(1),
  );

  constructor(private storageService: StorageService) {}

  public getAnswer$(questionId: string) {
    return this.answerMap$.pipe(map((answerMap) => answerMap.get(questionId)));
  }

  public clearAnswers(fromStorage = true): void {
    this.clearAnswers$.next();
    if (fromStorage) this.clearAnswersFromStorage();
  }

  /**
   * Add / update an answer in the answers map
   * @param gameId
   * @param questionId this can be week id for survivors
   * @param answerId
   */
  public putAnswer(answer: Answer): void {
    this.putAnswer$.next(answer);
  }

  private clearAnswersFromStorage(): void {
    this.storageService.remove(StorageItem.STORED_ANSWERS);
  }

  private storeMapInStorage(map: Map<string, string>): void {
    const item = JSON.stringify(Array.from(map.entries()));
    this.storageService.set(StorageItem.STORED_ANSWERS, item);
  }

  private getMapFromStorage(): Map<string, string> {
    const item = this.storageService.get(StorageItem.STORED_ANSWERS);
    if (!item) return new Map();
    try {
      const json = JSON.parse(item);
      return new Map(json);
    } catch (error) {
      return new Map();
    }
  }
}

type AnswerMap = Map<string, string>;
interface Answer {
  questionId: string;
  answerId: string | undefined;
}


const putAnswerInMap = (answerMap: AnswerMap, answer: Answer): AnswerMap => {
  if (answer.answerId && answerMap.get(answer.questionId) !== answer.answerId) {
    answerMap.set(answer.questionId, answer.answerId);
  } else {
    answerMap.delete(answer.questionId);
  }
  return answerMap;
};
