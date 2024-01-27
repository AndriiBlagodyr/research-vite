import { Link } from 'react-router-dom';

import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.notfoundLayout}>
      <h1>Not Found</h1>
      <Link to='/'>Home Page</Link>
    </div>
  );
}
