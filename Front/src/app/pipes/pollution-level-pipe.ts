import { Pipe, PipeTransform } from '@angular/core';
import { getPollutionLevel } from '../models/pollution.constants';

@Pipe({
  name: 'pollutionLevel'
})
export class PollutionLevelPipe implements PipeTransform {
  transform(indice: number): string {
    return getPollutionLevel(indice);
  }
}
