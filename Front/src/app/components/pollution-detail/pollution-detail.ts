import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PollutionService } from '../../services/pollution';
import { PollutionLevelPipe } from '../../pipes/pollution-level-pipe';
import { HighlightPollution } from '../../directives/highlight-pollution';

@Component({
  selector: 'app-pollution-detail',
  imports: [RouterLink, DatePipe, PollutionLevelPipe, HighlightPollution],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollutionDetailComponent {
  private pollutionService = inject(PollutionService);

  readonly id = input.required<number, string | number>({ transform: numberAttribute });

  readonly pollutionResource = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.pollutionService.getPollutionById(id)
  });
}