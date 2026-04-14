const QAS = [
  {
    question: "Why should I use a resume builder instead of a template?",
    answer: (
      <>
        <p>
          Traditional templates like Word or Google Docs require manual formatting, which is time-consuming and often leads to inconsistent styling. CareerCraft automates the formatting process, ensuring your resume is perfectly aligned, consistently styled, and optimized for ATS (Applicant Tracking Systems).
        </p>
        <p>
          Our builder also provides real-time AI suggestions and keyword matching, features you won't find in a static document template.
        </p>
      </>
    ),
  },
  {
    question: "Is my data safe and private?",
    answer: (
      <>
        <p>
          Absolutely. Privacy is our top priority. CareerCraft is designed to process your data locally in your browser. We don't store your personal information or resume content on our servers.
        </p>
        <p>
          You don't even need to create an account to use our core features. Your data stays with you, exactly where it belongs.
        </p>
      </>
    ),
  },
  {
    question: "Is CareerCraft really free?",
    answer: (
      <p>
        Yes, CareerCraft offers a powerful free tier that includes our core resume builder and ATS checker. Our mission is to make professional career tools accessible to everyone, regardless of their budget.
      </p>
    ),
  },
  {
    question: "How does the AI optimization work?",
    answer: (
      <p>
        Our AI analyzes your bullet points and suggests improvements based on industry best practices. It focuses on using strong action verbs, quantifying achievements, and ensuring your language is impact-oriented. This helps your resume stand out to both automated filters and human recruiters.
      </p>
    ),
  },
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="py-24 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-8">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{question}</h3>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
