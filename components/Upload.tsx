import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router';
import {
    PROGRESS_INCREMENT,
    PROGRESS_INTERVAL_MS,
    REDIRECT_DELAY_MS,
} from './lib/constants';

type UploadProps = {
    onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setisDragging] = useState(false);
    const [progress, setprogress] = useState(0);
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { isSignedIn } = useOutletContext<AuthContext>();

    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }

            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const processFile = (selectedFile: File) => {
        if (!isSignedIn) return;

        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
        }

        const reader = new FileReader();

        reader.onload = () => {
            const base64Data = reader.result;

            if (typeof base64Data !== 'string') return;

            setFile(selectedFile);
            setprogress(0);

            let simulatedProgress = 0;

            progressIntervalRef.current = setInterval(() => {
                simulatedProgress = Math.min(simulatedProgress + PROGRESS_INCREMENT, 100);
                setprogress(simulatedProgress);

                if (simulatedProgress === 100 && progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;

                    redirectTimeoutRef.current = setTimeout(() => {
                        onComplete?.(base64Data);
                    }, REDIRECT_DELAY_MS);
                }
            }, PROGRESS_INTERVAL_MS);
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;

        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            processFile(selectedFile);
        }

        event.target.value = '';
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!isSignedIn) return;

        setisDragging(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!isSignedIn) return;

        event.dataTransfer.dropEffect = 'copy';
        setisDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setisDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setisDragging(false);

        if (!isSignedIn) return;

        const droppedFile = event.dataTransfer.files?.[0];

        if (droppedFile) {
            processFile(droppedFile);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png"
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>
                            {isSignedIn ? (
                                "Click to upload or drag and drop"
                            ): ("Sign in or Sign up with Puter to upload")}
                        </p>
                        <p className="help">Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress == 100 ? (
                                <CheckCircle2 className="check" />
                            ): (
                                <ImageIcon className="image" />
                            )}
                        </div>
                        <h3>{file.name}</h3>

                        <div className='progress'>
                            <div className="bar" style={{ width: `${progress}%`}} />

                            <p className="status-text">
                                {progress < 100 ? `Analyzing Floor Plan...` : `Redirecting...`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Upload
