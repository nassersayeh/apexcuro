import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section id="testimonials" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          {t('landing.testimonials.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-gray-600 italic mb-4">"{t('landing.testimonials.quote1')}"</p>
            <p className="text-gray-800 font-semibold">{t('landing.testimonials.author1')}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-gray-600 italic mb-4">"{t('landing.testimonials.quote2')}"</p>
            <p className="text-gray-800 font-semibold">{t('landing.testimonials.author2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;