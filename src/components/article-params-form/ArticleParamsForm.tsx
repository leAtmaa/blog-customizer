import { useState, useEffect, useRef } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select/Select';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import clsx from 'clsx';

import 'src/fonts/font.scss';

import styles from './ArticleParamsForm.module.scss';

import {
	type ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

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
	// Состояние для отслеживания открыта/закрыта форма (меню)
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Состояния для готовых компонентов (шрифт, размер, ширина)
	const [selectedFont, setSelectedFont] = useState(
		currentParams.fontFamilyOption
	);
	const [selectedFontSize, setSelectedFontSize] = useState(
		currentParams.fontSizeOption
	);
	const [selectedWidth, setSelectedWidth] = useState(
		currentParams.contentWidth
	);

	// Состояния для кастомных селектов цвета
	const [isColorSelectOpen, setIsColorSelectOpen] = useState(false);
	const [selectedColor, setSelectedColor] = useState(
		currentParams.fontColor.title
	);

	const [isBgColorSelectOpen, setIsBgColorSelectOpen] = useState(false);
	const [selectedBgColor, setSelectedBgColor] = useState(
		currentParams.backgroundColor.title
	);

	// Создаем ref для меню
	const menuRef = useRef<HTMLDivElement>(null);

	// Используем хук для закрытия меню при клике вне
	useOutsideClickClose({
		isOpen: isMenuOpen,
		rootRef: menuRef,
		onClose: () => setIsMenuOpen(false),
		onChange: setIsMenuOpen,
	});

	// Синхронизация с currentParams при изменении извне
	useEffect(() => {
		setSelectedFont(currentParams.fontFamilyOption);
		setSelectedFontSize(currentParams.fontSizeOption);
		setSelectedWidth(currentParams.contentWidth);
		setSelectedColor(currentParams.fontColor.title);
		setSelectedBgColor(currentParams.backgroundColor.title);
	}, [currentParams]);

	const colorOptionsLocal = fontColors.map((color) => ({
		name: color.title,
		value: color.value,
	}));

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Находим объекты для кастомных цветов
		const fontColorObject = fontColors.find((c) => c.title === selectedColor);
		const bgColorObject = backgroundColors.find(
			(c) => c.title === selectedBgColor
		);

		const newParams: ArticleStateType = {
			fontFamilyOption: selectedFont,
			fontSizeOption: selectedFontSize,
			fontColor: fontColorObject || defaultArticleState.fontColor,
			backgroundColor: bgColorObject || defaultArticleState.backgroundColor,
			contentWidth: selectedWidth,
		};

		onApply(newParams);
	};

	// Обработчик сброса
	const handleReset = () => {
		onReset();
	};

	// Обработчик клика по стрелке (открыть/закрыть меню)
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<>
			<ArrowButton isOpen={isMenuOpen} onClick={toggleMenu} />
			{isMenuOpen && (
				<aside
					ref={menuRef}
					className={clsx(styles.container, {
						[styles.container_open]: isMenuOpen,
					})}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<h2 className={styles.tittleForm}>Задайте параметры</h2>

						{/* Шрифт - готовый */}
						<Select
							selected={selectedFont}
							options={fontFamilyOptions}
							onChange={setSelectedFont}
							title='Шрифт'
						/>

						{/* Размер шрифта - готовый */}
						<RadioGroup
							name='fontSize'
							options={fontSizeOptions}
							selected={selectedFontSize}
							onChange={setSelectedFontSize}
							title='Размер шрифта'
						/>

						{/* Цвет шрифта - кастомный */}
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

						{/* Цвет фона - кастомный */}
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

						{/* Ширина контента - готовый */}
						<Select
							selected={selectedWidth}
							options={contentWidthArr}
							onChange={setSelectedWidth}
							title='Ширина контента'
						/>

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
