import { useState } from 'react';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	type ArticleStateType,
} from './constants/articleProps';

import styles from './styles/index.module.scss';

export const App = () => {
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
			className={styles.main}
			style={{
				backgroundColor: articleParams.backgroundColor.value,
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
