import { useState, useEffect, useRef } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select/Select';
import { RadioGroup } from 'src/ui/radio-group/RadioGroup';
import { Separator } from 'src/ui/separator/Separator';
import clsx from 'clsx';

import 'src/fonts/font.scss';

import styles from './ArticleParamsForm.module.scss';

import {
	type ArticleStateType,
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

// Компонент для меню, который использует хук
const MenuContent = ({
	onClose,
	children,
}: {
	onClose: () => void;
	children: React.ReactNode;
}) => {
	const menuRef = useRef<HTMLDivElement>(null);

	useOutsideClickClose({
		isOpen: true,
		rootRef: menuRef,
		onClose: onClose,
		onChange: () => {},
	});

	return (
		<aside
			ref={menuRef}
			className={clsx(styles.container, styles.container_open)}>
			{children}
		</aside>
	);
};

export const ArticleParamsForm = ({
	onApply,
	onReset,
	currentParams,
}: ArticleParamsFormProps) => {
	// Состояние для отслеживания открыта/закрыта форма (меню)
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Состояния для параметров
	const [selectedFont, setSelectedFont] = useState(
		currentParams.fontFamilyOption
	);
	const [selectedFontSize, setSelectedFontSize] = useState(
		currentParams.fontSizeOption
	);
	const [selectedFontColor, setSelectedFontColor] = useState(
		currentParams.fontColor
	);
	const [selectedBgColor, setSelectedBgColor] = useState(
		currentParams.backgroundColor
	);
	const [selectedWidth, setSelectedWidth] = useState(
		currentParams.contentWidth
	);

	// Синхронизация с currentParams при изменении извне
	useEffect(() => {
		setSelectedFont(currentParams.fontFamilyOption);
		setSelectedFontSize(currentParams.fontSizeOption);
		setSelectedFontColor(currentParams.fontColor);
		setSelectedBgColor(currentParams.backgroundColor);
		setSelectedWidth(currentParams.contentWidth);
	}, [currentParams]);

	// Обработчик отправки формы
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newParams: ArticleStateType = {
			fontFamilyOption: selectedFont,
			fontSizeOption: selectedFontSize,
			fontColor: selectedFontColor,
			backgroundColor: selectedBgColor,
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
			{/* Проверка if (!isMenuOpen) return; - меню не рендерится, если закрыто */}
			{isMenuOpen && (
				<MenuContent onClose={() => setIsMenuOpen(false)}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<h2 className={styles.tittleForm}>Задайте параметры</h2>

						{/* Шрифт */}
						<Select
							selected={selectedFont}
							options={fontFamilyOptions}
							onChange={setSelectedFont}
							title='Шрифт'
						/>

						{/* Размер шрифта */}
						<RadioGroup
							name='fontSize'
							options={fontSizeOptions}
							selected={selectedFontSize}
							onChange={setSelectedFontSize}
							title='Размер шрифта'
						/>

						{/* Цвет шрифта */}
						<Select
							selected={selectedFontColor}
							options={fontColors}
							onChange={setSelectedFontColor}
							title='Цвет шрифта'
						/>

						<Separator />

						{/* Цвет фона */}
						<Select
							selected={selectedBgColor}
							options={backgroundColors}
							onChange={setSelectedBgColor}
							title='Цвет фона'
						/>

						{/* Ширина контента */}
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
				</MenuContent>
			)}
		</>
	);
};
