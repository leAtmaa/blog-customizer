import { createRoot } from 'react-dom/client';
import { StrictMode, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	type ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	const [articleParams, setArticleParams] =
		useState<ArticleStateType>(defaultArticleState);

	const handleApply = (newParams: ArticleStateType) => {
		setArticleParams(newParams);
	};

	const handleReset = () => {
		setArticleParams(defaultArticleState);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={{
				backgroundColor: articleParams.backgroundColor.value, // Фон применяется к main
			}}>
			<ArticleParamsForm
				onApply={handleApply}
				onReset={handleReset}
				currentParams={articleParams}
			/>
			<Article params={articleParams} />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
