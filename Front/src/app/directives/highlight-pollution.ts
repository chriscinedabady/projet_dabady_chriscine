import { Directive, computed, input } from '@angular/core';
import { getPollutionColor } from '../models/pollution.constants';

@Directive({
  selector: '[appHighlightPollution]',
  host: {
    '[style.backgroundColor]': 'backgroundColor()'
  }
})
export class HighlightPollution {
  readonly appHighlightPollution = input<number | string>(0);

  protected readonly backgroundColor = computed(() =>
    getPollutionColor(this.appHighlightPollution())
  );
}
