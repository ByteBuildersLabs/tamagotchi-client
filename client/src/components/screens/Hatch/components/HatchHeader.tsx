import { motion } from "framer-motion";
import type { EggState } from "../hooks/useEggAnimation";

interface HatchHeaderProps {
	showBeast: boolean;
	beastType: string;
	eggState: EggState;
}

export const HatchHeader = ({ showBeast, beastType, eggState }: HatchHeaderProps) => {
	const titleAnimation = {
		initial: { opacity: 0, y: -30 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.2,
				duration: 0.6,
				ease: "easeOut" as const
			}
		}
	};

	const subtitleAnimation = {
		initial: { opacity: 0, y: 20 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.4,
				duration: 0.5,
				ease: "easeOut" as const
			}
		}
	};

	return (
		<>
			{/* Title */}
			<motion.div
				className="text-center space-y-2"
				{...titleAnimation}
			>
				<h1 className="text-4xl sm:text-5xl md:text-6xl font-luckiest text-cream drop-shadow-lg">
					{showBeast ? `Your ${beastType.charAt(0).toUpperCase() + beastType.slice(1)}!` : 'Hatch Your Beast'}
				</h1>
			</motion.div>

			{/* Subtitle */}
			<motion.div
				className="text-center max-w-md"
				{...subtitleAnimation}
			>
				<p className="text-lg sm:text-xl font-rubik text-cream/90 drop-shadow-md leading-relaxed">
					{showBeast ? (
						<>
							<br />
						</>
					) : (
						<>
							<br />
							<span className={`font-semibold transition-colors duration-300 ${eggState === 'hatching' ? 'text-magenta' :
									eggState === 'completed' ? 'text-cyan' :
										eggState === 'revealing' ? 'text-emerald' : 'text-gold'
								}`}>
								{eggState === 'idle' ? '' :
									eggState === 'hatching' ? '' :
										eggState === 'completed' ? '' :
											''}
							</span>
						</>
					)}
				</p>
			</motion.div>
		</>
	);
};