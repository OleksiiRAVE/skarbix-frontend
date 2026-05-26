import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Plus, Tags } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/skeletons';
import { AddCategoryModal } from '@/components/categories/AddCategoryModal';
import { fetchCategories } from '@/lib/mock-api/api';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    fetchCategories().then((data) => {
      if (cancelled) return;
      setCategories(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--sk-text)]">{t('sidebar.categories')}</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((item) => <CardSkeleton key={item} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">{t('sidebar.categories')}</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-0.5">
            {categories.length} {t('categories.count', { count: categories.length })}
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="h-9 sm:h-10 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full px-3 sm:px-5 text-xs sm:text-sm w-fit"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
          <span className="hidden sm:inline">{t('addCategory.title')}</span>
          <span className="sm:hidden">{t('general.add')}</span>
        </Button>
      </div>

      {categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[280px] rounded-[20px] border border-dashed border-[var(--sk-border)] bg-[var(--sk-card)] flex flex-col items-center justify-center text-center px-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4">
            <Tags className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">{t('categories.emptyTitle')}</h2>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-1 max-w-[360px]">
            {t('categories.emptySubtitle')}
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            className="mt-5 h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-sm font-medium px-5"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('addCategory.title')}
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-[var(--sk-border)] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}18`, color: category.color }}
                >
                  <Icon icon={category.icon || 'lucide:tag'} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--sk-text)] truncate">{category.name}</p>
                  <p className="text-xs text-[var(--sk-text-secondary)]">
                    {category.kind === 'income' ? t('categories.kindIncome') : t('categories.kindExpense')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddCategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={loadCategories}
      />
    </div>
  );
}
