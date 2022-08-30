export interface ScoreSettings {
	noYakuFu: boolean;
	noYakuDora: boolean;
	openTanyao: boolean;
	ryuuiisouHatsu: boolean;
	multiYakuman: boolean;
	doubleYakuman: boolean;
	kiriageMangan: boolean;
	kazoeYakuman: boolean;
	doubleWindFu: boolean;
	rinshanFu: boolean;
	sanma: 'loss' | 'bisection' | null;
	akadora: boolean;
	usePao: boolean;
	otherScoring: boolean;
	disabledYaku: string[];
	enabledLocalYaku: string[];
}

export const DefaultSettings: ScoreSettings = {
	noYakuFu: false,
	noYakuDora: false,
	openTanyao: true,
	ryuuiisouHatsu: false,
	multiYakuman: true,
	doubleYakuman: true,
	kiriageMangan: false,
	kazoeYakuman: true,
	doubleWindFu: true,
	rinshanFu: true,
	sanma: null,
	akadora: true,
	usePao: false,
	otherScoring: false,
	disabledYaku: [],
	enabledLocalYaku: [],
};
