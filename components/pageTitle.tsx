import clsx from 'clsx';
import { ReactNode } from 'react';

interface PageTitleProps {
  title: string | ReactNode;
  classname?: string;
}

const PageTitle = ({ title, classname }: PageTitleProps) => {
  return (
    <h2
      className={clsx(
        'text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10 mt-4 md:mt-0',
        classname
      )}
    >
      {title}
    </h2>
  );
};

export default PageTitle;
