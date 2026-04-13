import { getAuthHeaders } from '@/shared/api/graphql/client';
import { EndPoints } from '@/shared/constants/model/base';
import {
	detectPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import React, { useEffect, useState } from 'react';

interface ImageProps {
	id?: string;
	src?: string;
	className?: string;
	style?: React.CSSProperties;
	alt?: string;
	onError?: () => void;
	onLoad?: () => void;
	fallbackIcon?: React.ReactNode;
}

export function UserImage({
	id,
	src,
	className,
	style,
	alt = 'User avatar',
	onError,
	onLoad,
	fallbackIcon,
}: ImageProps) {
	const [imageError, setImageError] = useState(false);
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

	useEffect(() => {
		const loadImage = async () => {
			if (src) {
				setImageDataUrl(src);
				return;
			}
			if (!id) {
				setImageDataUrl(null);
				return;
			}
			const imageUrl = `${EndPoints.userpic}/${id}`;
			const platform = detectPlatform();
			const isTelegram = isTgPlatform(platform);
			if (isTelegram) {
				try {
					const headers = await getAuthHeaders();

					const response = await fetch(imageUrl, {
						headers: headers,
						credentials: 'include',
					});

					if (!response.ok) {
						throw new Error(`HTTP ${response.status}`);
					}

					const blob = await response.blob();
					const url = URL.createObjectURL(blob);
					setImageDataUrl(url);
					setImageError(false);
				} catch (error) {
					console.error('Error loading user image:', error);
					setImageError(true);
					onError?.();
				} finally {
				}
			} else {
				setImageDataUrl(imageUrl);
			}
		};
		loadImage();
		return () => {
			if (
				imageDataUrl &&
				imageDataUrl !== src &&
				imageDataUrl.startsWith('blob:')
			) {
				URL.revokeObjectURL(imageDataUrl);
			}
		};
	}, [id, src]);

	if (!imageDataUrl || imageError) {
		return (
			fallbackIcon || (
				<div
					className={className}
					style={{
						...style,
						backgroundColor: '#e0e0e0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<span style={{ fontSize: '24px' }}>👤</span>
				</div>
			)
		);
	}

	if (isTgPlatform(detectPlatform()) && imageDataUrl.startsWith('blob:')) {
		return (
			<img
				src={imageDataUrl}
				alt={alt}
				className={className}
				style={style}
				onLoad={onLoad}
				loading='lazy'
			/>
		);
	}

	return (
		<img
			src={imageDataUrl}
			alt={alt}
			className={className}
			style={style}
			onError={() => {
				setImageError(true);
				onError?.();
			}}
			onLoad={onLoad}
			loading='lazy'
			crossOrigin={undefined}
		/>
	);
}
