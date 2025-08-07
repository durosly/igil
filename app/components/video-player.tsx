"use client";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import React, { useRef, useState } from "react";

function VideoPlayer({ url }: { url: string }) {
	const [isPlaying, setIsPlaying] = useState(true);
	const [isMuted, setIsMuted] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showControls, setShowControls] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setCurrentTime(videoRef.current.currentTime);
		}
	};

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = parseFloat(e.target.value);
		if (videoRef.current) {
			videoRef.current.currentTime = time;
			setCurrentTime(time);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const toggleFullscreen = () => {
		if (videoRef.current) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				videoRef.current.requestFullscreen();
			}
		}
	};

	return (
		<div
			className="bg-base-100 rounded-2xl shadow-xl overflow-hidden relative group"
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => setShowControls(false)}>
			<video
				muted={isMuted}
				autoPlay={isPlaying}
				ref={videoRef}
				loop
				className="w-full aspect-video bg-neutral"
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				onClick={togglePlay}>
				<source src={url} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Video Controls */}
			<div
				className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral/80 to-transparent p-4 transition-opacity duration-300 ${
					showControls ? "opacity-100" : "opacity-0"
				}`}>
				<div className="flex items-center space-x-4 text-neutral-content">
					<button
						onClick={togglePlay}
						className="p-2 hover:bg-neutral-content/20 rounded transition-colors">
						{isPlaying ? (
							<Pause className="w-5 h-5" />
						) : (
							<Play className="w-5 h-5" />
						)}
					</button>

					<div className="flex-1">
						<input
							type="range"
							min="0"
							max={duration || 0}
							value={currentTime}
							onChange={handleSeek}
							className="w-full h-1 bg-neutral-content/30 rounded-full appearance-none cursor-pointer slider"
							style={{
								background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
									(currentTime / duration) * 100
								}%, rgba(255,255,255,0.3) ${
									(currentTime / duration) * 100
								}%, rgba(255,255,255,0.3) 100%)`,
							}}
						/>
					</div>

					<span className="text-sm font-mono">
						{formatTime(currentTime)} / {formatTime(duration)}
					</span>

					<button
						onClick={toggleMute}
						className="p-2 hover:bg-neutral-content/20 rounded transition-colors">
						{isMuted ? (
							<VolumeX className="w-5 h-5" />
						) : (
							<Volume2 className="w-5 h-5" />
						)}
					</button>

					<button
						onClick={toggleFullscreen}
						className="p-2 hover:bg-neutral-content/20 rounded transition-colors">
						<Maximize2 className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Play Button Overlay */}
			{!isPlaying && (
				<div className="absolute inset-0 flex items-center justify-center">
					<button
						onClick={togglePlay}
						className="w-20 h-20 bg-neutral-content/20 rounded-full flex items-center justify-center hover:bg-neutral-content/30 transition-colors">
						<Play className="w-10 h-10 text-neutral-content ml-1" />
					</button>
				</div>
			)}
		</div>
	);
}

export default VideoPlayer;
