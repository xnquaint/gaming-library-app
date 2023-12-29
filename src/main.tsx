import ReactDOM from 'react-dom/client'
import './index.css'
import { Root } from './Root.tsx'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Root />);
} else {
  console.error('Could not find root element');
}
