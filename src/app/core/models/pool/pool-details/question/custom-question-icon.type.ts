import { GE_Position } from 'src/app/core/models/pool/pool-details/game-engine-pool-details.interface';

export function getPositionCustomIcon(
  position: GE_Position,
  index: number,
): CustomQuestionIconData | undefined {
  index += 1;
  const POSITION_TO_ICON_MAP: Record<string, CustomQuestionIconData> = {
    batsmen: {
      incompleteImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_batsmen.png',
      defaultCompletedImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_batsmen.png-completed',
      label: `Pick ${index}`,
    },
    'master blaster': {
      incompleteImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_masterblaster.png',
      defaultCompletedImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_masterblaster.png-completed',
      label: `Pick ${index}`,
    },
    'all rounders': {
      incompleteImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_masterblaster.png',
      defaultCompletedImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_masterblaster.png-completed',
      label: `Pick ${index}`,
    },
    'bowler 1': {
      incompleteImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_allrounder.png',
      defaultCompletedImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_allrounder.png-completed',
      label: `Pick ${index}`,
    },
    'bowler 2': {
      incompleteImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_bowler.png',
      defaultCompletedImageUrl:
        'https://media.miomni.com/uploads/graphic_cricket_bowler.png-completed',
      label: `Pick ${index}`,
    },
  };
  return POSITION_TO_ICON_MAP[position.label.toLowerCase()];
}

export interface CustomQuestionIconData {
  defaultCompletedImageUrl: string;
  incompleteImageUrl: string;
  label: string;
}

export interface CustomQuestionIcon {
  icon: string;
  label: string;
}
