'use client';

export const Modal = ({ children, }: { children: React.ReactNode }) => {
    return (
        <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/50 z-40" />
            
            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded border shadow-lg p-4 max-w-2xl w-full mx-4">
                    {children}
                </div>
            </div>
        </>
    );
}