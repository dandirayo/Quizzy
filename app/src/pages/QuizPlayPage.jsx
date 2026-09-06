import React from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import styles from './QuizPlayPage.module.css';

export default function QuizPlayPage() {
  const { quizId } = useParams();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topNav}>
        <Link to="/" className={styles.backLink}>
          &larr; Kembali
        </Link>
      </div>
      <div className={styles.quizWrapper}>
        <QuizEngine quizId={quizId} />
      </div>
    </div>
  );
}
