import { memo } from 'react';

interface Props {
  title: string;
}

function TitleService({ title }: Props) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-2 border-purple-neon/30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-purple-dark text-purple-neon font-bold text-lg uppercase tracking-wide">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(TitleService);
