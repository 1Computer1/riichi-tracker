import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import JumpButton from '../components/JumpButton';
import Tiles from '../components/Tiles';
import Toggle from '../components/Toggle';
import TileButton from '../components/calculator/TileButton';
import Left from '../components/icons/heroicons/Left';
import Right from '../components/icons/heroicons/Right';
import Up from '../components/icons/heroicons/Up';
import VerticalRow from '../components/layout/VerticalRow';
import H from '../components/text/H';
import { calculateHanFu, TileCode, TilesBySuit } from '../lib/hand';
import { DefaultSettings, ScoreSettings } from '../lib/settings';
import { referenceToYaku, Yaku, YakuReferenceNode, YakuReferenceSort } from '../lib/yaku';

export default function Reference() {
	const navigate = useNavigate();
	const tabs = ['tiles', 'yaku', 'scoring'];
	const [params, setSearchParams] = useSearchParams();
	const [tabsEl, setTabsEl] = useState<Element | null>(null);

	return (
		<div className="min-h-screen bg-slate-200 dark:bg-gray-900 text-black dark:text-white">
			<div className="flex flex-row justify-center">
				<div className="w-full h-screen overflow-y-auto">
					<div className="fixed z-10 top-2 left-2 lg:top-4 lg:left-4 flex flex-col gap-y-2">
						<CircleButton
							onClick={() => {
								navigate('/', { replace: true });
							}}
						>
							<Left />
						</CircleButton>
					</div>
					<div className="invisible sm:visible z-10 fixed bottom-2 right-2 lg:bottom-4 lg:right-8 flex flex-col gap-y-2">
						<JumpButton element={tabsEl}>
							<Up />
						</JumpButton>
					</div>
					<div ref={setTabsEl} className="flex flex-col justify-center items-center w-full gap-y-2">
						<div className="flex flex-col justify-center items-center w-full gap-y-2 px-2 py-2">
							<h1 className="text-2xl lg:text-4xl">Reference</h1>
						</div>
						<Tab.Group
							defaultIndex={params.has('tab') ? tabs.indexOf(params.get('tab')!) : 0}
							onChange={(i) => {
								setSearchParams({ tab: tabs[i] }, { replace: true });
							}}
						>
							<Tab.List className="flex flex-row flex-wrap gap-2 justify-center items-center mb-2">
								<StyledTab>Tiles</StyledTab>
								<StyledTab>Yaku List</StyledTab>
								<StyledTab>Scoring Table</StyledTab>
							</Tab.List>
							<Tab.Panels className="w-full min-h-screen flex flex-col justify-center px-2 py-4 lg:py-8 bg-slate-300 dark:bg-sky-900">
								<Tab.Panel>
									<TileReference />
								</Tab.Panel>
								<Tab.Panel>
									<YakuReference />
								</Tab.Panel>
								<Tab.Panel>
									<ScoreReference />
								</Tab.Panel>
							</Tab.Panels>
						</Tab.Group>
					</div>
				</div>
			</div>
		</div>
	);
}

function StyledTab({ children }: { children: ReactNode }) {
	return (
		<Tab
			className={({ selected }) =>
				clsx(
					'border border-gray-800 rounded-xl shadow p-1 lg:p-2',
					'w-52 lg:w-80 h-10 lg:h-14 text-xl lg:text-2xl',
					selected
						? 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800'
						: 'bg-gray-50 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600',
				)
			}
		>
			{children}
		</Tab>
	);
}

function TileReference() {
	return (
		<VerticalRow>
			<h2 className="text-xl lg:text-3xl">Characters</h2>
			<LabeledTiles suited tiles={TilesBySuit.m.map((t) => [t, t[0]])} />
			<h2 className="text-xl lg:text-3xl">Circles</h2>
			<LabeledTiles suited tiles={TilesBySuit.p.map((t) => [t, t[0]])} />
			<h2 className="text-xl lg:text-3xl">Bamboo</h2>
			<LabeledTiles suited tiles={TilesBySuit.s.map((t) => [t, t[0]])} />
			<h2 className="text-xl lg:text-3xl">Winds</h2>
			<LabeledTiles
				tiles={[
					['1z', 'East'],
					['2z', 'South'],
					['3z', 'West'],
					['4z', 'North'],
				]}
			/>
			<h2 className="text-xl lg:text-3xl">Dragons</h2>
			<LabeledTiles
				tiles={[
					['5z', 'White'],
					['6z', 'Green'],
					['7z', 'Red'],
				]}
			/>
		</VerticalRow>
	);
}

function LabeledTiles({ suited = false, tiles }: { suited?: boolean; tiles: [TileCode, string][] }) {
	return suited ? (
		<div className="flex flex-row flex-wrap justify-center items-center gap-x-1 lg:gap-x-2">
			<div className="flex flex-row flex-wrap justify-center items-center gap-x-1 lg:gap-x-2">
				{tiles.slice(0, 5).map((t, i) => (
					<div key={i} className="flex flex-col justify-center items-center">
						<span className="text-base lg:text-lg">{t[1]}</span>
						<TileButton tile={t[0]} forced />
					</div>
				))}
			</div>
			<div className="flex flex-row flex-wrap justify-center items-center gap-x-1 lg:gap-x-2">
				{tiles.slice(5).map((t, i) => (
					<div key={i} className="flex flex-col justify-center items-center">
						<span className="text-base lg:text-lg">{t[1]}</span>
						<TileButton tile={t[0]} forced />
					</div>
				))}
			</div>
		</div>
	) : (
		<div className="flex flex-row flex-wrap justify-center items-center gap-x-1 lg:gap-x-2">
			{tiles.map((t, i) => (
				<div key={i} className="flex flex-col justify-center items-center">
					<span className="text-base lg:text-lg">{t[1]}</span>
					<TileButton tile={t[0]} forced />
				</div>
			))}
		</div>
	);
}

function YakuReference() {
	const [showLocal, setShowLocal] = useState(false);
	const [onlyBasic, setOnlyBasic] = useState(false);
	const [hideYakuman, setHideYakuman] = useState(false);

	const yakuFilter = (y: YakuReferenceNode) => {
		const yaku = referenceToYaku(y);
		return (
			(onlyBasic ? yaku.basic : true) &&
			(showLocal ? true : yaku.type !== 'local') &&
			(hideYakuman ? !yaku.yakuman : true)
		);
	};

	return (
		<div className="flex flex-col gap-y-4 lg:gap-y-8">
			<div className="flex flex-row flex-wrap gap-2 justify-center items-center">
				<Button active={showLocal} onClick={() => setShowLocal(!showLocal)}>
					Show Local
				</Button>
				<Button active={onlyBasic} onClick={() => setOnlyBasic(!onlyBasic)}>
					Only Easy
				</Button>
				<Button active={hideYakuman} onClick={() => setHideYakuman(!hideYakuman)}>
					Hide Yakuman
				</Button>
			</div>
			<div className="flex flex-col gap-y-1 lg:gap-y-2">
				{YakuReferenceSort.filter(yakuFilter).map((y, i) => {
					const inners = y.inner.filter(yakuFilter);
					return (
						<div key={y.t === 'yaku' ? y.yaku : i} className="w-full">
							<YakuItem yaku={referenceToYaku(y)} />
							{inners.length > 0 && (
								<div className="w-full flex flex-col justify-center items-center gap-1 lg:gap-2 mt-1 lg:mt-2">
									{inners.map((z, j) => (
										<div
											key={z.t === 'yaku' ? z.yaku : j}
											className="relative w-full flex flex-row justify-around items-center pl-6 lg:pl-10"
										>
											<div className="absolute left-0 w-4 lg:w-8 flex flex-col justify-center items-center">
												<Right />
											</div>
											<YakuItem yaku={referenceToYaku(z)} />
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function YakuItem({ yaku }: { yaku: Omit<Yaku, 'id'> }) {
	return (
		<div className="w-full p-2 lg:p-4 rounded shadow bg-slate-200 dark:bg-gray-900">
			<div className="w-full flex flex-row justify-between items-center">
				{yaku.yakuman ? (
					<span className="text-base lg:text-xl">
						<H>
							{['', 'Double', 'Triple', 'Quadruple', 'Quintuple', 'Sextuple'][yaku.value - 1] ?? `${yaku.value}x`}{' '}
							Yakuman
						</H>
					</span>
				) : (
					<span className="text-base lg:text-xl">
						<H>
							{yaku.value}
							{yaku.per && 'x'}{' '}
						</H>
						Han
					</span>
				)}
				<div className="flex flex-row justify-end items-center">
					{yaku.closedOnly && (
						<span className="text-base lg:text-xl">
							<H.Red>Closed only</H.Red>
						</span>
					)}
					{yaku.openMinus && (
						<span className="text-base lg:text-xl">
							<H.Red>-1 if open</H.Red>
						</span>
					)}
					{yaku.type === 'extra' && (
						<span className="text-base lg:text-xl">
							<H.Red>Not yaku</H.Red>
						</span>
					)}
				</div>
			</div>
			<div className="w-full flex flex-col justify-center items-start gap-2">
				<h2 className="flex flex-row text-lg lg:text-2xl font-medium gap-x-2">
					{yaku.name}{' '}
					{(yaku.basic || yaku.type === 'local') && (
						<H>
							<span className="flex flex-row gap-x-2 text-sm lg:text-base justify-center items-center">
								{yaku.basic && <span className="bg-slate-300 dark:bg-sky-900 rounded shadow p-0.5 lg:p-1">Easy</span>}
								{yaku.type === 'local' && (
									<span className="bg-slate-300 dark:bg-sky-900 rounded shadow p-0.5 lg:p-1">Local</span>
								)}
							</span>
						</H>
					)}
				</h2>
				{yaku.help && <div className="text-base lg:text-lg">{yaku.help}</div>}
				{yaku.example && (
					<div className="w-full flex flex-row justify-center items-center">
						<Tiles sets={yaku.example} small />
					</div>
				)}
			</div>
		</div>
	);
}

function ScoreReference() {
	const [sanma, setSanma] = useState<'loss' | 'bisection' | null>(null);
	const settings = { ...DefaultSettings, sanma };

	const mangan = calculateHanFu(5, 30, settings);
	const haneman = calculateHanFu(6, 30, settings);
	const baiman = calculateHanFu(8, 30, settings);
	const sanbaiman = calculateHanFu(11, 30, settings);
	const yakuman = calculateHanFu(13, 30, settings);

	return (
		<div className="flex flex-col justify-center items-center gap-2">
			<div className="flex flex-row flex-wrap gap-4 lg:gap-6 justify-center items-center">
				<div className="w-40 h-40 lg:w-48 lg:h-48 flex flex-col justify-center items-center gap-2 lg:gap-4 p-0.5 rounded shadow bg-slate-200 dark:bg-gray-900">
					<span className="text-lg font-semibold">
						<H>Legend</H>
					</span>
					<div className="w-full flex flex-row justify-center items-center text-xs lg:text-sm italic">
						<span className="w-1/2 flex flex-row justify-center items-center">Dealer</span>
						<span className="w-1/2 flex flex-row justify-center items-center">Non-Dealer</span>
					</div>
					<div className="relative w-full flex flex-col justify-center items-center gap-2 text-sm lg:text-base">
						<div className="w-full flex flex-row justify-center items-center">
							<span className="w-1/2 flex flex-row justify-center items-center text-center">
								Tsumo
								<br />
								Win/Loss
							</span>
							<span className="w-1/2 flex flex-row justify-center items-center text-center">
								Tsumo
								<br />
								Win/Loss
							</span>
						</div>
						<div className="absolute h-full w-0 border border-gray-800"></div>
						<div className="w-full flex flex-row justify-center items-center">
							<span className="w-1/2 flex flex-row justify-center items-center">Ron</span>
							<span className="w-1/2 flex flex-row justify-center items-center">Ron</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center gap-2">
					<div className="flex flex-row flex-wrap lg:flex-nowrap justify-center items-center gap-2">
						<div className="flex flex-row justify-between items-center gap-2 w-[7.5rem] lg:w-[9rem]">
							<span className="text-xl lg:text-2xl">Game Mode</span>
						</div>
						<div className="flex flex-row flex-wrap gap-2 justify-center items-start w-[13rem] md:w-[20.5rem]">
							<Toggle
								left="4-Player"
								right="3-Player"
								toggled={sanma != null}
								onToggle={() => setSanma(sanma ? null : 'loss')}
							/>
						</div>
					</div>
					{sanma != null && (
						<div className="flex flex-row flex-wrap lg:flex-nowrap justify-center items-center gap-2">
							<div className="flex flex-row justify-between items-center gap-2 w-[7.5rem] lg:w-[9rem]">
								<span className="text-xl lg:text-2xl">Tsumo Points</span>
							</div>
							<div className="flex flex-row flex-wrap gap-2 justify-center items-start w-[13rem] md:w-[20.5rem]">
								<Toggle
									left="Loss"
									right="Bisection"
									toggled={sanma === 'bisection'}
									onToggle={() => setSanma(sanma === 'loss' ? 'bisection' : 'loss')}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<ul className="flex flex-col justify-center items-center gap-2">
				<li>
					<Han han={1} fus={[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]} settings={settings} />
				</li>
				<li>
					<Han han={2} fus={[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]} settings={settings} />
				</li>
				<li>
					<Han han={3} fus={[20, 25, 30, 40, 50, 60]} settings={settings} />
				</li>
				<li>
					<Han han={4} fus={[20, 25, 30]} settings={settings} />
				</li>
				<li>
					<ScoreSection
						title={
							<span>
								<H>3</H> Han <H>70</H> Fu / <H>4</H> Han <H>40</H> Fu / <H>5</H> Han
							</span>
						}
					>
						<ScoreCard title={<H>Mangan</H>} points={mangan} />
					</ScoreSection>
				</li>
				<li>
					<ScoreSection
						title={
							<span>
								<H>6</H> Han / <H>7</H> Han
							</span>
						}
					>
						<ScoreCard title={<H>Haneman</H>} points={haneman} />
					</ScoreSection>
				</li>
				<li>
					<ScoreSection
						title={
							<span>
								<H>8</H> Han / <H>9</H> Han / <H>10</H> Han
							</span>
						}
					>
						<ScoreCard title={<H>Baiman</H>} points={baiman} />
					</ScoreSection>
				</li>
				<li>
					<ScoreSection
						title={
							<span>
								<H>11</H> Han / <H>12</H> Han
							</span>
						}
					>
						<ScoreCard title={<H>Sanbaiman</H>} points={sanbaiman} />
					</ScoreSection>
				</li>
				<li>
					<ScoreSection
						title={
							<span>
								<H>13+</H> Han
							</span>
						}
					>
						<ScoreCard title={<H>Yakuman</H>} points={yakuman} />
					</ScoreSection>
				</li>
			</ul>
			<ul className="text-base lg:text-xl flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc px-6">
				<li>
					<H>3</H> han <H>60</H> fu and <H>4</H> han <H>30</H> fu can be rounded up to a <H>mangan</H> in certain rule
					variations.
				</li>
				<li>
					Scoring table in three-player is the same as four-player unless north bisection is used. In that case, points
					that would have been lost from the north player is redistributed.
				</li>
				<li>
					The general formula is as follows:
					<ol className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-decimal ml-4 lg:ml-8 mt-1">
						<li>
							If the hand is a <H>yakuman</H>, score 8000 basic points per <H>yakuman</H>. Skip to step 8.
						</li>
						<li>Determine yaku and dora to count up the han value.</li>
						<li>
							For han of <H>5</H> or more, counting fu is not necessary, skip to step 8:
							<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
								<li>
									<H>5</H> = <H>mangan</H> worth 2000 basic points.
								</li>
								<li>
									<H>6-7</H> = <H>haneman</H> worth 3000 basic points.
								</li>
								<li>
									<H>8-10</H> = <H>baiman</H> worth 4000 basic points.
								</li>
								<li>
									<H>11-12</H> = <H>sanbaiman</H> worth 6000 basic points.
								</li>
								<li>
									<H>13+</H> = <H>yakuman</H> worth 8000 basic points.
								</li>
							</ul>
						</li>
						<li>
							Determine fu value using hand composition, rounded up to the nearest 10:
							<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
								<li>
									<H>20</H> base fu
									<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
										<li>
											<H>+2</H> for winning with tsumo
										</li>
										<li>
											<H>+10</H> for winning with closed ron
										</li>
										<li>
											<H>+2</H> for having a single wait
										</li>
										<li>
											<H>+2</H> per yakuhai pair (some rules may have <H>+4</H> for double wind pair)
										</li>
									</ul>
								</li>
								<li>
									<H>+2</H> fu per triplet
									<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
										<li>
											<H>x2</H> if concealed
										</li>
										<li>
											<H>x2</H> if terminals or honors
										</li>
										<li>
											<H>x4</H> if kan
										</li>
									</ul>
								</li>
								<li>
									Seven pairs is always <H>25</H> fu.
								</li>
								<li>
									Pinfu tsumo is always <H>20</H> fu.
								</li>
								<li>
									Open hands are always worth at least <H>30</H> fu.
								</li>
							</ul>
						</li>
						<li>
							Calculate basic points with{' '}
							<span className="font-mono">
								fu×2<sup>2+han</sup>
							</span>
							.
						</li>
						<li>
							If using rounded <H>mangan</H> rules, round 1920 basic points to 2000.
						</li>
						<li>
							If above 2000 basic points but at <H>4</H> or fewer han, fix at a <H>mangan</H> of 2000 points.
						</li>
						<li>
							On a win, transfer basic points rounded up to the nearest 100:
							<ul className="flex flex-col justify-center items-start gap-y-1 lg:gap-y-2 list-disc ml-4 lg:ml-8 mt-1">
								<li>
									Non-dealer tsumo: <H>1x</H> from other non-dealers, <H>2x</H> from dealer.
								</li>
								<li>
									Non-dealer ron: <H>4x</H> from dealt-in player.
								</li>
								<li>
									Dealer tsumo: <H>2x</H> from all other players.
								</li>
								<li>
									Dealer ron: <H>6x</H> from dealt-in player.
								</li>
							</ul>
						</li>
					</ol>
				</li>
			</ul>
		</div>
	);
}

function Han({ han, fus, settings }: { han: number; fus: number[]; settings: ScoreSettings }) {
	return (
		<ScoreSection
			title={
				<span>
					<H>{han}</H> Han
				</span>
			}
		>
			<ul className="flex flex-row flex-wrap gap-1 justify-center items-center">
				{fus.map((fu) => (
					<li key={fu}>
						<Fu han={han} fu={fu} settings={settings} />
					</li>
				))}
			</ul>
		</ScoreSection>
	);
}

function Fu({ han, fu, settings }: { han: number; fu: number; settings: ScoreSettings }) {
	const res = calculateHanFu(han, fu, settings);
	const noTsumo = (han === 1 && fu === 20) || (han === 1 && fu === 25) || (han === 2 && fu === 25);
	const noRon =
		(han === 1 && fu === 20) ||
		(han === 1 && fu === 25) ||
		(han === 2 && fu === 20) ||
		(han === 3 && fu === 20) ||
		(han === 4 && fu === 20);
	return (
		<ScoreCard
			title={
				<span>
					<H>{fu}</H> Fu
				</span>
			}
			noTsumo={noTsumo}
			noRon={noRon}
			points={res}
		/>
	);
}

function ScoreSection({ title, children }: { title: ReactNode; children: ReactNode }) {
	return (
		<div className="flex flex-col justify-center items-center gap-2">
			<span className="text-xl lg:text-2xl font-bold">{title}</span>
			{children}
		</div>
	);
}

function ScoreCard({
	title,
	noTsumo = false,
	noRon = false,
	points,
}: {
	title: ReactNode;
	noTsumo?: boolean;
	noRon?: boolean;
	points: {
		tsumoAsFromOya: number;
		tsumoAsKo: number;
		ronAsOya: number;
		ronAsKo: number;
	};
}) {
	return (
		<div className="w-28 h-28 lg:w-32 lg:h-32 flex flex-col justify-center items-center gap-1 lg:gap-3 p-0.5 rounded shadow bg-slate-200 dark:bg-gray-900">
			<span className="text-lg xl:text-xl font-semibold">{title}</span>
			<div className="relative w-full flex flex-col justify-center items-center gap-0.5 lg:gap-1 text-sm lg:text-lg">
				<div className="w-full flex flex-row justify-center items-center">
					<span className="w-1/2 flex flex-row justify-center items-center">
						{noTsumo ? '--' : points.tsumoAsFromOya}
					</span>
					<span className="w-1/2 flex flex-row justify-center items-center">{noTsumo ? '--' : points.tsumoAsKo}</span>
				</div>
				<div className="absolute h-full w-0 border border-gray-800"></div>
				<div className="w-full flex flex-row justify-center items-center">
					<span className="w-1/2 flex flex-row justify-center items-center">{noRon ? '--' : points.ronAsOya}</span>
					<span className="w-1/2 flex flex-row justify-center items-center">{noRon ? '--' : points.ronAsKo}</span>
				</div>
			</div>
		</div>
	);
}
