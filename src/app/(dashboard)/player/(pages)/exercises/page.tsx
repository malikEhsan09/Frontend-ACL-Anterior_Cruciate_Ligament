
//! New code

// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import {
//   ChevronDown,
//   ChevronUp,
//   CheckCircle,
//   Calendar,
//   Check,
//   X,
// } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";

// interface Exercise {
//   title: string;
//   description: string;
//   imageSrc: string;
//   steps: string[];
//   isCompleted: boolean;
//   isScheduled: boolean;
// }

// const initialExercises: Exercise[] = [
//   {
//     title: "Heel raises",
//     description: "Strengthen your calf muscles and improve ankle stability.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZHsOifv8ps9e4hRswdF1n0tz63Oe3V.png",
//     steps: [
//       "Stand with your feet hip-width apart",
//       "Slowly raise your heels off the ground",
//       "Hold for 2-3 seconds",
//       "Lower your heels back down",
//       "Repeat 10-15 times for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Straight leg raises",
//     description:
//       "Strengthen your quadriceps without putting stress on your knee joint.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UAzcElPML9fAP0KCECuJAVXl6hufBm.png",
//     steps: [
//       "Lie on your back with one leg bent and the other straight",
//       "Tighten the thigh muscles of the straight leg",
//       "Lift the straight leg up about 12 inches",
//       "Hold for 5 seconds, then slowly lower",
//       "Repeat 10-15 times for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Everyday knee extensions",
//     description:
//       "Improve range of motion and strengthen the muscles around your knee.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HOsW2fCN4s5anvsepJ5UXiwxxpvkeV.png",
//     steps: [
//       "Sit in a chair with your feet flat on the ground",
//       "Slowly extend one leg out in front of you",
//       "Hold for 5 seconds",
//       "Slowly lower your leg back down",
//       "Repeat 10-15 times for 2-3 sets on each leg",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Quad sets",
//     description: "Activate and strengthen your quadriceps muscles.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-akkHRkHgTLBPUxFSjQbbenFusS9RXa.png",
//     steps: [
//       "Sit or lie with your leg straight out in front of you",
//       "Tighten your thigh muscle, pushing the back of your knee down",
//       "Hold for 5 seconds",
//       "Relax and repeat",
//       "Do 2-3 sets of 10-15 repetitions",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Half squat",
//     description: "Build strength in your thighs, hips, and calves.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-77t7zqarPQFwe3t65Nfaaq08RxnxAU.png",
//     steps: [
//       "Stand with feet shoulder-width apart",
//       "Slowly bend your knees, lowering your body as if sitting back into a chair",
//       "Stop at about 45 degrees (half squat)",
//       "Hold for 5 seconds, then slowly stand back up",
//       "Repeat 10 times for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Heel slides",
//     description: "Improve knee flexion and mobility.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jTuwjfCpLRstpQHqhhGu3Gqvy8IOoP.png",
//     steps: [
//       "Lie on your back with legs straight",
//       "Slowly slide your heel towards your buttocks, bending your knee",
//       "Hold for 5 seconds",
//       "Slide your heel back to the starting position",
//       "Repeat 10-15 times for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Knee bends",
//     description: "Increase flexibility and range of motion in your knee.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nyL3zsaDaYM9MfKuckyb5RCq8t8Bsh.png",
//     steps: [
//       "Stand holding onto a stable surface for balance",
//       "Slowly bend your knee, bringing your heel towards your buttocks",
//       "Hold for 5 seconds",
//       "Slowly lower your foot back to the ground",
//       "Repeat 10-15 times for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Double leg squat",
//     description:
//       "Strengthen your thighs, hips, and improve overall lower body stability.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W3oMIUZ88tWiI2LMhKkeFEjlhe5ewi.png",
//     steps: [
//       "Stand with feet shoulder-width apart",
//       "Slowly lower your body as if sitting back into a chair",
//       "Keep your chest up and your weight in your heels",
//       "Lower until your thighs are parallel to the ground (or as far as comfortable)",
//       "Slowly return to standing",
//       "Repeat 10 times for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
//   {
//     title: "Partial lunges",
//     description: "Build strength and stability in your legs and core.",
//     imageSrc:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZHsOifv8ps9e4hRswdF1n0tz63Oe3V.png",
//     steps: [
//       "Stand with feet hip-width apart",
//       "Take a small step forward with one foot",
//       "Bend both knees slightly, lowering your body about 6 inches",
//       "Hold for 5 seconds",
//       "Push back to the starting position",
//       "Repeat 10 times on each leg for 2-3 sets",
//     ],
//     isCompleted: false,
//     isScheduled: false,
//   },
// ];

// export default function Component() {
//   const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
//   const [openExercises, setOpenExercises] = useState<number[]>([]);
//   const [progress, setProgress] = useState(0);
//   const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

//   useEffect(() => {
//     const completedCount = exercises.filter((ex) => ex.isCompleted).length;
//     setProgress((completedCount / exercises.length) * 100);
//   }, [exercises]);

//   const toggleExercise = (index: number) => {
//     if (expandedExercise === null) {
//       setOpenExercises((prev) =>
//         prev.includes(index)
//           ? prev.filter((i) => i !== index)
//           : [...prev, index]
//       );
//     }
//   };

//   const toggleCompletion = (index: number) => {
//     setExercises((prev) =>
//       prev.map((ex, i) =>
//         i === index ? { ...ex, isCompleted: !ex.isCompleted } : ex
//       )
//     );
//   };

//   const toggleSchedule = (index: number) => {
//     setExercises((prev) =>
//       prev.map((ex, i) =>
//         i === index ? { ...ex, isScheduled: !ex.isScheduled } : ex
//       )
//     );
//   };

//   const expandExercise = (index: number) => {
//     setExpandedExercise(index);
//   };

//   const closeExpandedExercise = () => {
//     setExpandedExercise(null);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 relative">
//       <div className="flex flex-col mb-6">
//         <div className="flex items-center mb-2">
//           <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
//           <h2 className="text-xl font-bold text-gray-800">
//             ACL Injury Exercises
//           </h2>
//           <span className="text-md bg-red-100 text-red-800 border-red-500 rounded-2xl ml-3 w-max p-1">
//             ACL Tear
//           </span>
//         </div>
//         <div className="mt-4 flex items-center space-x-4">
//           <h3 className="text-lg font-semibold whitespace-nowrap">
//             Recovery Progress:
//           </h3>
//           <div className="flex-grow">
//             <Progress value={progress} className="h-2" />
//           </div>
//           <span className="text-sm font-medium whitespace-nowrap">
//             {progress.toFixed(0)}%
//           </span>
//         </div>
//         {progress === 100 && (
//           <div className="mt-2 flex items-center text-green-600 text-sm">
//             <Check className="mr-1" />
//             You have completed all exercises successfully!
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {exercises.map((exercise, index) => (
//           <Card
//             key={index}
//             className={`overflow-hidden ${
//               exercise.isCompleted ? "border-t-4 border-green-500" : ""
//             } ${
//               expandedExercise === index
//                 ? "fixed inset-4 z-50 m-auto w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-4xl"
//                 : ""
//             } transition-all duration-300 ease-in-out`}
//           >
//             <CardHeader
//               className="p-4 cursor-pointer"
//               onClick={() =>
//                 expandedExercise === null
//                   ? toggleExercise(index)
//                   : expandExercise(index)
//               }
//             >
//               <div className="flex items-center space-x-4">
//                 <Image
//                   src={exercise.imageSrc}
//                   alt={exercise.title}
//                   width={60}
//                   height={60}
//                   className="rounded-md object-cover"
//                 />
//                 <h3
//                   className={`font-medium text-lg flex-grow ${
//                     exercise.isCompleted ? "line-through text-gray-500" : ""
//                   }`}
//                 >
//                   {exercise.title}
//                 </h3>
//                 <div className="flex space-x-2">
//                   <Button
//                     size="icon"
//                     variant={exercise.isCompleted ? "default" : "outline"}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleCompletion(index);
//                     }}
//                   >
//                     <CheckCircle
//                       className={
//                         exercise.isCompleted ? "text-white" : "text-gray-400"
//                       }
//                     />
//                   </Button>
//                   <Button
//                     size="icon"
//                     variant={exercise.isScheduled ? "default" : "outline"}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleSchedule(index);
//                     }}
//                   >
//                     <Calendar
//                       className={
//                         exercise.isScheduled ? "text-white" : "text-gray-400"
//                       }
//                     />
//                   </Button>
//                 </div>
//                 {expandedExercise === index ? (
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       closeExpandedExercise();
//                     }}
//                   >
//                     <X className="text-gray-500" />
//                   </Button>
//                 ) : openExercises.includes(index) ? (
//                   <ChevronUp className="text-gray-500" />
//                 ) : (
//                   <ChevronDown className="text-gray-500" />
//                 )}
//               </div>
//             </CardHeader>
//             {(openExercises.includes(index) || expandedExercise === index) && (
//               <CardContent className="p-4 bg-gray-50">
//                 <p className="text-gray-700 mb-4">{exercise.description}</p>
//                 <h4 className="font-semibold mb-2">Steps:</h4>
//                 <ol className="list-decimal pl-5 space-y-2">
//                   {exercise.steps.map((step, stepIndex) => (
//                     <li key={stepIndex} className="text-gray-600">
//                       {step}
//                     </li>
//                   ))}
//                 </ol>
//                 <div className="mt-4 flex justify-between items-center">
//                   <span className="text-sm text-gray-500">
//                     {exercise.isCompleted ? "Completed" : "Not completed"}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     {exercise.isScheduled ? "Scheduled" : "Not scheduled"}
//                   </span>
//                 </div>
//               </CardContent>
//             )}
//           </Card>
//         ))}
//       </div>
//       {expandedExercise !== null && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={closeExpandedExercise}
//         ></div>
//       )}
//     </div>
//   );
// }

// ! thirsd new code

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Calendar,
  Check,
  X,
  Loader,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Exercise {
  title: string;
  description: string;
  imageSrc: string;
  steps: string[];
  isCompleted: boolean;
  isScheduled: boolean;
  injuryType: string;
}

const Exercises  = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [openExercises, setOpenExercises] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [aclTearExists, setAclTearExists] = useState(false);
  const [partialAclTearExists, setPartialAclTearExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noMoreExercises, setNoMoreExercises] = useState(false);

  // Fetch exercises based on ACL assessment results
  const fetchExercises = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No auth token found");
        return;
      }

      // Fetch ACL assessment results
      const response = await fetch(
        "http://localhost:8800/api/aclAssessmentResult",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const assessmentResults = await response.json();
      const injuryTypes: string[] = [];

      // Collect unique injury types from the assessment results
      assessmentResults.forEach((result: { assessmentResult: string }) => {
        if (!injuryTypes.includes(result.assessmentResult)) {
          injuryTypes.push(result.assessmentResult);
        }
      });

      // Check if ACL Tear or Partial ACL Tear exists
      setAclTearExists(injuryTypes.includes("ACL Tear"));
      setPartialAclTearExists(
        injuryTypes.includes("Partial ACL Tear OR Partially Injured")
      );

      // Fetch exercises for the injury types
      const exercisesPromises = injuryTypes.map((injuryType) =>
        fetch(
          `http://localhost:8800/api/aclRehab/exercises/${encodeURIComponent(
            injuryType
          )}`
        )
      );

      const exercisesResponses = await Promise.all(exercisesPromises);
      const exercisesData = await Promise.all(
        exercisesResponses.map((res) => res.json())
      );

      // Flatten the exercise arrays into one
      const allExercises = exercisesData.flat();
      setExercises(allExercises);
    } catch (error) {
      console.error("Error fetching exercises", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const completedCount = exercises.filter((ex) => ex.isCompleted).length;
    setProgress((completedCount / exercises.length) * 100);
  }, [exercises]);

  const toggleExercise = (index: number) => {
    if (expandedExercise === null) {
      setOpenExercises((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    }
  };

  const toggleCompletion = (index: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === index ? { ...ex, isCompleted: !ex.isCompleted } : ex
      )
    );
  };

  const toggleSchedule = (index: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === index ? { ...ex, isScheduled: !ex.isScheduled } : ex
      )
    );
  };

  const expandExercise = (index: number) => {
    setExpandedExercise(index);
  };

  const closeExpandedExercise = () => {
    setExpandedExercise(null);
  };

  const loadMoreExercises = async () => {
    setIsLoading(true);
    try {
      // Fetch more exercises logic here
      // For example, you can fetch the next set of exercises from the server
      const response = await fetch(
        "http://localhost:8800/api/aclRehab/exercises/more"
      );
      const moreExercises = await response.json();

      if (moreExercises.length === 0) {
        setNoMoreExercises(true);
      } else {
        setExercises((prev) => [...prev, ...moreExercises]);
      }
    } catch (error) {
      console.error("Error loading more exercises", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 relative">
      <div className="flex flex-col mb-6">
        <div className="flex items-center mb-2">
          <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">
            ACL Injury Exercises
          </h2>
          {aclTearExists && (
            <span className="text-md bg-red-100 text-red-800 border-red-500 rounded-xl ml-3 w-max p-1 px-2">
              ACL Tear
            </span>
          )}
          {partialAclTearExists && (
            <span className="text-md bg-yellow-100 text-yellow-800 border-yellow-500 rounded-xl ml-3 w-max p-1 px-2">
              Partial ACL Tear
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <h3 className="text-lg font-semibold whitespace-nowrap">
            Recovery Progress:
          </h3>
          <div className="flex-grow">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">
            {progress.toFixed(0)}%
          </span>
        </div>
        {progress === 100 && (
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <Check className="mr-1" />
            You have completed all exercises successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise, index) => (
          <Card
            key={index}
            className={`overflow-hidden ${
              exercise.isCompleted ? "border-t-4 border-green-500" : ""
            } ${
              expandedExercise === index
                ? "fixed inset-4 z-50 m-auto w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-4xl"
                : ""
            } transition-all duration-300 ease-in-out`}
          >
            <CardHeader
              className="p-4 cursor-pointer"
              onClick={() =>
                expandedExercise === null
                  ? toggleExercise(index)
                  : expandExercise(index)
              }
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={exercise.imageSrc}
                  alt={exercise.title}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <h3
                  className={`font-medium text-lg flex-grow ${
                    exercise.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {exercise.title}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant={exercise.isCompleted ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompletion(index);
                    }}
                  >
                    <CheckCircle
                      className={
                        exercise.isCompleted ? "text-white" : "text-gray-400"
                      }
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant={exercise.isScheduled ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSchedule(index);
                    }}
                  >
                    <Calendar
                      className={
                        exercise.isScheduled ? "text-white" : "text-gray-400"
                      }
                    />
                  </Button>
                </div>
                {expandedExercise === index ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeExpandedExercise();
                    }}
                  >
                    <X className="text-gray-500" />
                  </Button>
                ) : openExercises.includes(index) ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </div>
            </CardHeader>
            {(openExercises.includes(index) || expandedExercise === index) && (
              <CardContent className="p-4 bg-gray-50">
                <p className="text-gray-700 mb-4">{exercise.description}</p>
                <h4 className="font-semibold mb-2">Steps:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  {exercise.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-600">
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {exercise.isCompleted ? "Completed" : "Not completed"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {exercise.isScheduled ? "Scheduled" : "Not scheduled"}
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {!noMoreExercises && exercises.length > 0 && (
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
            onClick={loadMoreExercises}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mr-2 w-5 h-5" />
            ) : (
              <span className="material-icons mr-2">refresh</span>
            )}
            {isLoading ? "Loading..." : "Load more"}
          </button>
        )}

        {noMoreExercises && (
          <div className="text-center text-gray-600 py-4">
            No more exercises available.
          </div>
        )}
      </div>
      {expandedExercise !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeExpandedExercise}
        ></div>
      )}
    </div>
  );
};

export default Exercises ;
