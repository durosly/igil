"use client";
import React from "react";
import Slider from "react-slick";

const HeroSlider = () => {
	const slideSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		fade: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 500,
		arrows: false,
		className: "hero-slider",
	};

	const slides = [
		{
			type: "video",
			videoSrc: "https://videos.pexels.com/video-files/4468789/4468789-uhd_2560_1440_24fps.mp4",
			title: "The IDAN advantage",
			text: "Local relationships backed by an expansive portfolio of services custom scaled to you.",
			button: { label: "About Us", link: "/about-us" },
		},
		{
			type: "image",
			bg: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
			title: "Our Culture",
			text: "Entrepreneurs at heart, we move nimbly to untangle challenges, find efficiencies, and take smart risks.",
			button: { label: "How We Work", link: "/about-us" },
		},
		{
			type: "image",
			bg: "https://images.unsplash.com/photo-1498631906572-66c58d46ecf7",
			title: "Our People",
			text: "We’re seasoned pros who are also personable and down to earth. We don’t overcomplicate.",
			button: { label: "Join Us", link: "/contact-us" },
		},
	];

	return (
		<section className="hero-slider-section relative bg-primary">
			<Slider {...slideSettings}>
				{slides.map((slide, index) => (
					<div key={index} className="hero-slide relative">
						<div className="background-angle"></div>
						{slide.type === "video" ? (
							<div className="video-wrapper">
								<video
									className="bg-video w-full h-[calc(100dvh_-_80px)] object-cover"
									muted
									autoPlay
									loop
									playsInline>
									<source src={slide.videoSrc} type="video/mp4" />
								</video>
							</div>
						) : (
							<div
								className="hero-background h-[calc(100dvh_-_80px)] bg-cover bg-center"
								style={{ backgroundImage: `url(${slide.bg})` }}
							/>
						)}

						<div className="hero-content absolute inset-0 flex items-center justify-center text-center z-10">
							<div className="content max-w-xl mx-auto text-white px-6">
								<h1 className="text-4xl font-bold mb-4">
									{slide.title}
								</h1>
								<p className="mb-6">{slide.text}</p>
								<a href={slide.button.link} className="btn btn-primary">
									{slide.button.label}
								</a>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</section>
	);
};

export default HeroSlider;
