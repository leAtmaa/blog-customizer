import { useState, useEffect } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import clsx from 'clsx';

import 'src/fonts/font.scss';

import styles from './ArticleParamsForm.module.scss';

import wideIcon from 'src/images/wide.svg';
import narrowIcon from 'src/images/narrow.svg';

import {
	type ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

interface ArticleParamsFormProps {
	onApply: (params: ArticleStateType) => void;
	onReset: () => void;
	currentParams: ArticleStateType;
}

export const ArticleParamsForm = ({
	onApply,
	onReset,
	currentParams,
}: ArticleParamsFormProps) => {
	// Состояние для отслеживания открыта/закрыта форма
	const [isOpen, setIsOpen] = useState(false);

	// Состояния для селекта шрифта
	const [isFontSelectOpen, setIsFontSelectOpen] = useState(false);
	const [selectedFont, setSelectedFont] = useState(
		currentParams.fontFamilyOption.title
	);

	// Состояние для выбора размера шрифта
	const [selectedFontSize, setSelectedFontSize] = useState(() => {
		const size = currentParams.fontSizeOption.title;
		if (size === '18px') return '18 px';
		if (size === '25px') return '25 px';
		return '38 px';
	});

	// Состояния для селекта цвета шрифта
	const [isColorSelectOpen, setIsColorSelectOpen] = useState(false);
	const [selectedColor, setSelectedColor] = useState(
		currentParams.fontColor.title
	);

	// Состояния для селекта цвета фона
	const [isBgColorSelectOpen, setIsBgColorSelectOpen] = useState(false);
	const [selectedBgColor, setSelectedBgColor] = useState(
		currentParams.backgroundColor.title
	);

	// Состояния для селекта ширины контента
	const [isWidthSelectOpen, setIsWidthSelectOpen] = useState(false);
	const [selectedWidth, setSelectedWidth] = useState(
		currentParams.contentWidth.title
	);

	// Синхронизация с currentParams при изменении извне
	useEffect(() => {
		setSelectedFont(currentParams.fontFamilyOption.title);

		const sizeWithSpace =
			currentParams.fontSizeOption.title === '18px'
				? '18 px'
				: currentParams.fontSizeOption.title === '25px'
				? '25 px'
				: '38 px';
		setSelectedFontSize(sizeWithSpace);

		setSelectedColor(currentParams.fontColor.title);
		setSelectedBgColor(currentParams.backgroundColor.title);
		setSelectedWidth(currentParams.contentWidth.title);
	}, [currentParams]);

	const fontOptions = fontFamilyOptions.map((opt) => opt.title);
	const fontSizeOptionsLocal = ['18 px', '25 px', '38 px'];
	const widthOptions = [
		{ name: 'Узкий', icon: narrowIcon },
		{ name: 'Широкий', icon: wideIcon },
	];
	const colorOptionsLocal = fontColors.map((color) => ({
		name: color.title,
		value: color.value,
	}));

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Находим ПОЛНЫЕ объекты параметров
		const fontObject = fontFamilyOptions.find((f) => f.title === selectedFont);
		const normalizedSize = selectedFontSize.replace(' ', '');
		const fontSizeObject = fontSizeOptions.find(
			(f) => f.title === normalizedSize
		);
		const fontColorObject = fontColors.find((c) => c.title === selectedColor);
		const bgColorObject = backgroundColors.find(
			(c) => c.title === selectedBgColor
		);
		const widthObject = contentWidthArr.find((w) => w.title === selectedWidth);

		// Собираем новые параметры
		const newParams: ArticleStateType = {
			fontFamilyOption: fontObject || defaultArticleState.fontFamilyOption,
			fontSizeOption: fontSizeObject || defaultArticleState.fontSizeOption,
			fontColor: fontColorObject || defaultArticleState.fontColor,
			backgroundColor: bgColorObject || defaultArticleState.backgroundColor,
			contentWidth: widthObject || defaultArticleState.contentWidth,
		};

		onApply(newParams);
	};

	// Обработчик сброса
	const handleReset = () => {
		onReset();
	};

	// Обработчик клика по стрелке
	const toggleForm = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={toggleForm} />
			{isOpen && (
				<aside
					className={clsx(styles.container, {
						[styles.container_open]: isOpen,
					})}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<h2 className={styles.tittleForm}>Задайте параметры</h2>

						{/* Селект для шрифта */}
						<div className={styles.selectWrapper}>
							<p className={styles.labelOption}>Шрифт</p>
							<div
								className={clsx(
									styles.customSelect,
									isFontSelectOpen && styles.customSelectOpen
								)}
								onClick={() => setIsFontSelectOpen(!isFontSelectOpen)}>
								<span>{selectedFont}</span>
							</div>
							{isFontSelectOpen && (
								<div className={styles.optionsList}>
									{fontOptions.map((font) => (
										<div
											key={font}
											className={clsx(
												styles.optionItem,
												selectedFont === font && styles.optionItemSelected
											)}
											onClick={() => {
												setSelectedFont(font);
												setIsFontSelectOpen(false);
											}}>
											<span style={{ fontFamily: font }}>{font}</span>
										</div>
									))}
								</div>
							)}
						</div>

						{/* РАЗМЕР ШРИФТА */}
						<div className={styles.fontSizeSection}>
							<p className={styles.labelOption}>Размер шрифта</p>
							<div className={styles.fontSizeButtons}>
								{fontSizeOptionsLocal.map((size) => (
									<button
										key={size}
										type='button'
										className={clsx(
											styles.fontSizeButton,
											selectedFontSize === size && styles.fontSizeButtonActive
										)}
										onClick={() => setSelectedFontSize(size)}>
										{size}
									</button>
								))}
							</div>
						</div>

						{/* Селект для цвета шрифта */}
						<div className={styles.selectWrapper}>
							<p className={styles.labelOption}>Цвет шрифта</p>
							<div
								className={clsx(
									styles.customSelect,
									isColorSelectOpen && styles.customSelectOpen
								)}
								onClick={() => setIsColorSelectOpen(!isColorSelectOpen)}>
								<div className={styles.selectedColorDisplay}>
									<div className={styles.colorSquareContainer}>
										<div
											className={styles.colorSquare}
											style={{
												backgroundColor: colorOptionsLocal.find(
													(c) => c.name === selectedColor
												)?.value,
											}}
											data-color={selectedColor === 'Белый' ? 'white' : ''}
										/>
										{selectedColor && (
											<div
												className={clsx(
													styles.selectedCircle,
													selectedColor === 'Белый' &&
														styles.selectedCircleBlack
												)}
											/>
										)}
									</div>
									<span>{selectedColor}</span>
								</div>
							</div>
							{isColorSelectOpen && (
								<div className={styles.optionsList}>
									{colorOptionsLocal.map((color) => {
										const isDisabled = color.name === selectedColor;
										return (
											<div
												key={color.name}
												className={clsx(
													styles.optionItem,
													styles.colorOption,
													selectedColor === color.name &&
														styles.optionItemSelected,
													isDisabled && styles.optionItemDisabled
												)}
												onClick={() => {
													if (!isDisabled) {
														setSelectedColor(color.name);
														setIsColorSelectOpen(false);
													}
												}}>
												<div className={styles.colorDisplay}>
													<div className={styles.colorSquareContainer}>
														<div
															className={clsx(
																styles.colorSquare,
																isDisabled && styles.disabled
															)}
															style={{ backgroundColor: color.value }}
															data-color={color.name === 'Белый' ? 'white' : ''}
														/>
														{selectedColor === color.name && (
															<div
																className={clsx(
																	styles.selectedCircle,
																	color.name === 'Белый' &&
																		styles.selectedCircleBlack
																)}
															/>
														)}
													</div>
													<span>{color.name}</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						<div className={styles.divider}></div>

						{/* Селект для цвета фона */}
						<div className={styles.selectWrapper}>
							<p className={styles.labelOption}>Цвет фона</p>
							<div
								className={clsx(
									styles.customSelect,
									isBgColorSelectOpen && styles.customSelectOpen
								)}
								onClick={() => setIsBgColorSelectOpen(!isBgColorSelectOpen)}>
								<div className={styles.selectedColorDisplay}>
									<div className={styles.colorSquareContainer}>
										<div
											className={styles.colorSquare}
											style={{
												backgroundColor: colorOptionsLocal.find(
													(c) => c.name === selectedBgColor
												)?.value,
											}}
											data-color={selectedBgColor === 'Белый' ? 'white' : ''}
										/>
										{selectedBgColor && (
											<div
												className={clsx(
													styles.selectedCircle,
													selectedBgColor === 'Белый' &&
														styles.selectedCircleBlack
												)}
											/>
										)}
									</div>
									<span>{selectedBgColor}</span>
								</div>
							</div>
							{isBgColorSelectOpen && (
								<div className={styles.optionsList}>
									{colorOptionsLocal.map((color) => {
										const isDisabled = color.name === selectedBgColor;
										return (
											<div
												key={color.name}
												className={clsx(
													styles.optionItem,
													styles.colorOption,
													selectedBgColor === color.name &&
														styles.optionItemSelected,
													isDisabled && styles.optionItemDisabled
												)}
												onClick={() => {
													if (!isDisabled) {
														setSelectedBgColor(color.name);
														setIsBgColorSelectOpen(false);
													}
												}}>
												<div className={styles.colorDisplay}>
													<div className={styles.colorSquareContainer}>
														<div
															className={clsx(
																styles.colorSquare,
																isDisabled && styles.disabled
															)}
															style={{ backgroundColor: color.value }}
															data-color={color.name === 'Белый' ? 'white' : ''}
														/>
														{selectedBgColor === color.name && (
															<div
																className={clsx(
																	styles.selectedCircle,
																	color.name === 'Белый' &&
																		styles.selectedCircleBlack
																)}
															/>
														)}
													</div>
													<span>{color.name}</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Селект для ширины контента */}
						<div className={styles.selectWrapper}>
							<p className={styles.labelOption}>Ширина контента</p>
							<div
								className={clsx(
									styles.customSelect,
									isWidthSelectOpen && styles.customSelectOpen
								)}
								onClick={() => setIsWidthSelectOpen(!isWidthSelectOpen)}>
								<div className={styles.selectedWidthDisplay}>
									<img
										src={selectedWidth === 'Широкий' ? wideIcon : narrowIcon}
										alt={selectedWidth}
										className={styles.widthIcon}
									/>
									<span>{selectedWidth}</span>
								</div>
							</div>
							{isWidthSelectOpen && (
								<div className={styles.optionsList}>
									{widthOptions.map((option) => (
										<div
											key={option.name}
											className={clsx(
												styles.optionItem,
												selectedWidth === option.name &&
													styles.optionItemSelected
											)}
											onClick={() => {
												setSelectedWidth(option.name);
												setIsWidthSelectOpen(false);
											}}>
											<div className={styles.widthDisplay}>
												<img src={option.icon} className={styles.widthIcon} />
												<span>{option.name}</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<div className={styles.bottomContainer}>
							<Button
								title='Сбросить'
								htmlType='reset'
								type='clear'
								onClick={handleReset}
							/>
							<Button title='Применить' htmlType='submit' type='apply' />
						</div>
					</form>
				</aside>
			)}
		</>
	);
};
