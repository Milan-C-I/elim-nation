"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MovieCredits = () => {
  const [isVisible, setIsVisible] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.onclick = () => {
      //   vidRef.current?.play();
      if (vidRef.current?.paused) {
        vidRef.current?.play();
      } else {
        vidRef.current?.pause();
      }
    };

    setIsVisible(true);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center font-mono justify-center overflow-hidden relative bg-black">
      {/* Background video with opacity */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={vidRef}
          className="w-full h-full object-cover opacity-40"
          autoPlay
          loop
          //   muted
          playsInline
        >
          <source src="/AbsoluteCinema.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Credits container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center  justify-center overflow-hidden text-white font-sans">
        <div
          className={`flex flex-col items-center transition-transform mt-[100rem] duration-[60000ms] ease-linear ${
            isVisible ? "-translate-y-1/2" : "translate-y-1/2"
          }`}
          style={{
            minHeight: "fitContent", // Increased height to ensure full content is visible
            fontFamily: "Geist, sans-serif",
          }}
        >
          {/* Credits content */}
          <div className="py-8 text-center">
            <div className="mb-16">
              <p className="text-lg mb-2">WRITTEN BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">RAP BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">MUSIC BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">MIX & MASTER</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">Dance BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">PRODUCED BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">CO PRODUCED BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">DIRECTED BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">STARRING</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">CINEMATOGRAPHER</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">EDITOR</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">VISUAL EFFECTS</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">COLORIST</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">JOKE BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">DAD JOKE ENGINEERED BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">TERRIBLE PUN BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">A MASTERPIECE OF HUMOR BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">REGRETTABLE JOKE BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">CHEF'S SPECIAL, SERVED BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">CERTIFIED COOLNESS BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">ANOTHER 200 IQ IDEA BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">SAVED THE DAY AGAIN, BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE </p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">
                SPONSORED BY ABSOLUTELY NO ONE, BUT STILL
              </p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">THIS MESSAGE IS APPROVED BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">
                GENERATED BY AI, BUT STILL CLAIMED BY
              </p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">DECISION MADE IN 5 SECONDS BY</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-16">
              <p className="text-lg mb-2">NO THOUGHTS, JUST VIBES FROM</p>
              <p className="text-4xl font-bold">HIMANSHU HEGDE</p>
            </div>

            <div className="mb-24">
              <h2 className="text-2xl mb-8">
                A Production by Enigma Organization
              </h2>
              <h1 className="text-5xl font-bold mb-8">PRESENTS</h1>
              <h1 className="text-6xl font-bold mb-16">
                <span className="text-red-700">ELIM</span>-NATION
              </h1>

              <div className="mb-8">
                <p className="text-xl mb-2">Directed By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Produced By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Masters of Ceremony (MCs)</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Event Concept & Planning By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Execution & Operations By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Marketing & Publicity By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Design & Media By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Technical Support & Logistics By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Music & Audio Production By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-8">
                <p className="text-xl mb-2">Creative Direction & Branding By</p>
                <p className="text-2xl font-bold">Himanshu Hegde</p>
              </div>

              <div className="mb-16">
                <div className="mt-4">
                  {Array(100)
                    .fill(" Himanshu Saarrr")
                    .map((name, index) => (
                      <p key={index} className="text-5xl font-bold my-14">
                        <span className="text-5xl mb-4">
                          Special Thanks To{" "}
                        </span>
                        {name}
                      </p>
                    ))}
                </div>
              </div>

              <div className="mt-8 mb-8">
                <p className="text-5xl font-bold my-14">
                  <span className="text-9xl mb-4">Special Thanks To </span>
                  <br />
                  <span className="text-9xl mb-4"> Himanshu Saarrr</span>
                  <br />
                  <span className="text-9xl mb-4"> & </span>
                </p>
              </div>

              <div className="mb-8">
                <p className="text-xl font-bold">The Enigma Community</p>
              </div>

              <div className="mb-8">
                <p className="text-xl font-bold">
                  All Participants & Volunteers
                </p>
              </div>

              <div className="mb-8">
                <p className="text-xl font-bold">
                  Everyone Who Made This Possible
                </p>
              </div>

              <p className="text-sm mt-16">
                © <span className="text-red-700">ELIM</span>-NATION 2025
              </p>
            </div>
          </div>
          <div className="sticky top-0 h-screen w-full overflow-hidden mb-80 flex flex-col justify-center align-center">
            <div className="mt-28 text-center">
              <p className="text-5xl font-bold my-2">
                <span className="text-7xl mb-0">CREDITS TO :</span>
              </p>
            </div>
            <Image
              src="/writtenby.png"
              alt="elimnation"
              width={1920}
              height={1080}
              sizes="95vw"
              className="w-[95vw] block h-screen object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCredits;
