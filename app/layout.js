import './globals.css';

export const metadata = {
  title: 'Veo 3.1 AI Video Studio',
  description: 'Generate 8K ultra-realistic cinematic videos with Google Veo 3.1.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
