import React from 'react'
import Load from './load.tsx'
import '../styles/content.css'

const Content = ({ site }: { site: string }) => {
    const LazyContent = React.lazy(async () => {
        try {
            const module = await import(`./contents/${site}.tsx`);
            const content = module[site];

            if (!content) {
                React.useEffect(() => { console.error }, []);
                return { default: () => null };
            }

            return { default: content };
        } catch (err) {
            React.useEffect(() => { console.log(err) }, []);
            return { default: () => null };
        }
    });

    return (
        <React.Suspense fallback={<Load site={site} />}>
            <LazyContent />
        </React.Suspense>
    );
}

export default Content;
