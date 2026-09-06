import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUIZ_META, QUIZ_CATEGORIES } from '../data/quizCatalog';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter quizzes by category
  const filteredQuizzes = activeCategory === 'all'
    ? QUIZ_META
    : QUIZ_META.filter(quiz => {
        const category = QUIZ_CATEGORIES.find(c => c.id === activeCategory);
        return category?.quizIds?.includes(quiz.id);
      });

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Quizzy &mdash; <span className={styles.gradientText}>Kenali Dirimu</span>
        </h1>
        <p className={styles.subtitle}>
          Temukan sisi-sisi menarik dari kepribadianmu melalui kuis interaktif yang seru dan reflektif.
        </p>
      </section>

      <section className={styles.exploreSection}>
        <div className={styles.sectionHeader}>
          <h2>Jelajahi Quiz</h2>
          <span className={styles.quizCount}>{filteredQuizzes.length} quiz</span>
        </div>

        <div className={styles.tabs}>
          {QUIZ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.tab} ${activeCategory === cat.id ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map(quiz => (
              <Link to={`/quiz/${quiz.id}`} key={quiz.id} className={styles.quizCard}>
                <div
                  className={styles.cardGradient}
                  style={{
                    background: `linear-gradient(135deg, ${quiz.colors[0]}22, ${quiz.colors[1]}22)`
                  }}
                />
                <div className={styles.cardContent}>
                  <div className={styles.emoji}>{quiz.emoji}</div>
                  <h3 className={styles.quizTitle}>{quiz.title}</h3>
                  <p className={styles.quizDesc}>{quiz.subtitle}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.questionCount}>{quiz.questionCount} pertanyaan</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Belum ada kuis di kategori ini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
