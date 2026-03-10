import type { Service } from '../../../types';

interface Props {
  service: Service;
  imageError: boolean;
  imageLoading: boolean;
  onImageLoad: () => void;
  onImageError: () => void;
}

export default function ServicePreview({ service, imageError, imageLoading, onImageLoad, onImageError }: Props) {
  return (
    <div className="mb-6">
      <div className="relative h-40 rounded-md overflow-hidden mb-4 bg-linear-to-br from-purple-neon/20 to-blue-neon/20">
        {imageLoading && !imageError && service.image && (
          <div className="skeleton h-full w-full absolute inset-0" />
        )}

        {imageError || !service.image ? (
          <div className="h-full w-full flex items-center justify-center">
            <svg className="w-16 h-16 text-purple-neon/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img
            src={service.image}
            alt={service.title}
            className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            loading="eager"
            onLoad={onImageLoad}
            onError={onImageError}
          />
        )}

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-dark/60 to-purple-dark" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-cyber-white">{service.title}</h3>
        </div>
      </div>

      {service.service_points && service.service_points.length > 0 && (
        <ul className="space-y-2">
          {service.service_points.map((point, index) =>
            point ? (
              <li key={index} className="flex items-start text-sm text-cyber-white/80">
                <svg className="w-4 h-4 text-green-neon mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{point}</span>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
