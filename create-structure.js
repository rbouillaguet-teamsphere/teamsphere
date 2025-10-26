// create-structure.js
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const structure = {
  src: {
    components: {
      ui: {
        'Button.jsx': 'export default function Button() { return <button>Button</button>; }',
        'Input.jsx': 'export default function Input() { return <input />; }',
        'Select.jsx': 'export default function Select() { return <select></select>; }',
        'Card.jsx': 'export default function Card({ children }) { return <div className="card">{children}</div>; }',
        'index.js': `export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Card } from './Card';`
      },
      onboarding: {
        steps: {
          'ClubStep.jsx': 'export default function ClubStep() { return <div>Étape 1 : Créer le club</div>; }',
          'TeamStep.jsx': 'export default function TeamStep() { return <div>Étape 2 : Créer l\'équipe</div>; }',
          'PlayersStep.jsx': 'export default function PlayersStep() { return <div>Étape 3 : Ajouter des joueurs</div>; }',
          'InvitesStep.jsx': 'export default function InvitesStep() { return <div>Étape 4 : Inviter des membres</div>; }',
          'index.js': `export { default as ClubStep } from './ClubStep';
export { default as TeamStep } from './TeamStep';
export { default as PlayersStep } from './PlayersStep';
export { default as InvitesStep } from './InvitesStep';`
        },
        'OnboardingWizard.jsx': 'export default function OnboardingWizard() { return <div>Onboarding Wizard</div>; }',
        'ProgressBar.jsx': 'export default function ProgressBar() { return <div>Progress Bar</div>; }',
        'SuccessScreen.jsx': 'export default function SuccessScreen() { return <div>Succès !</div>; }',
        'index.js': `export { default as OnboardingWizard } from './OnboardingWizard';
export { default as ProgressBar } from './ProgressBar';
export { default as SuccessScreen } from './SuccessScreen';
export * from './steps';`
      }
    },
    pages: {
      'LandingPage.jsx': 'export default function LandingPage() { return <div>Page d\'accueil</div>; }',
      'SignupPage.jsx': 'export default function SignupPage() { return <div>Inscription</div>; }',
      'WelcomeScreen.jsx': 'export default function WelcomeScreen() { return <div>Bienvenue</div>; }'
    },
    router: {
      'index.jsx': `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import SignupPage from '../pages/SignupPage';
import WelcomeScreen from '../pages/WelcomeScreen';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}`
    }
  }
};

function createStructure(basePath, obj) {
  for (const [name, content] of Object.entries(obj)) {
    const currentPath = path.join(basePath, name);
    if (typeof content === 'object') {
      mkdirSync(currentPath, { recursive: true });
      createStructure(currentPath, content);
    } else {
      writeFileSync(currentPath, content);
      console.log(`✅ Created file: ${currentPath}`);
    }
  }
}

createStructure('.', structure);
console.log('\n🎉 Structure complète générée avec succès !');
