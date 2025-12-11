"use client";

import Image from "next/image";
import { Upload, Loader, Trash2, MoreHorizontal, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa"; // Custom alert icon
import { Menu, Transition } from "@headlessui/react"; // For dropdown menu
import { Dialog as DeleteDialog } from "@/components/ui/dialog";

interface Exercise {
  _id: string;
  title: string;
  description: string;
  imageSrc: string;
  steps: string[];
  injuryType: string;
  isCompleted: boolean;
  isScheduled: boolean;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    injuryType: "",
    steps: [] as string[],
    imageSrc: null as File | null,
  });
  const [editExercise, setEditExercise] = useState<Exercise | null>(null); // For editing
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [openAlert, setOpenAlert] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete confirmation
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null); // To track which exercise is to be deleted

  // Fetch exercises from backend
  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8800/api/aclRehab", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchExercises when component mounts
  useEffect(() => {
    fetchExercises();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewExercise({ ...newExercise, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewExercise({ ...newExercise, imageSrc: e.target.files[0] });
    }
  };

  // Handle adding new steps to the exercise
  const handleStepChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const stepsCopy = [...newExercise.steps];
    stepsCopy[index] = e.target.value;
    setNewExercise({ ...newExercise, steps: stepsCopy });
  };

  // Add a new step input
  const addNewStep = () => {
    setNewExercise({ ...newExercise, steps: [...newExercise.steps, ""] });
  };

  // Handle form submission for creating/updating an exercise
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("title", newExercise.title);
      formData.append("description", newExercise.description);
      formData.append("injuryType", newExercise.injuryType);
      formData.append("steps", JSON.stringify(newExercise.steps));
      if (newExercise.imageSrc) {
        formData.append("imageSrc", newExercise.imageSrc);
      }

      const endpoint = editExercise
        ? `http://localhost:8800/api/aclRehab/exercises/${editExercise._id}`
        : "http://localhost:8800/api/aclRehab/exercises";

      const method = editExercise ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          editExercise
            ? "Failed to update exercise"
            : "Failed to create exercise"
        );
      }

      const updatedExercise = await response.json();
      if (editExercise) {
        setExercises((prev) =>
          prev.map((ex) =>
            ex._id === updatedExercise._id ? updatedExercise : ex
          )
        );
      } else {
        setExercises([...exercises, updatedExercise]);
      }

      setAlertMessage(
        editExercise
          ? "Exercise updated successfully!"
          : "Exercise created successfully!"
      );
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);

      setDialogOpen(false); // Close the modal

      // Reset form
      setNewExercise({
        title: "",
        description: "",
        injuryType: "",
        steps: [],
        imageSrc: null,
      });
      setEditExercise(null);
      fetchExercises(); // Re-fetch the exercises after creating/updating
    } catch (error) {
      toast.error(
        editExercise
          ? "Failed to update exercise."
          : "Failed to create exercise."
      );
      console.error("Error creating/updating exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const confirmDeleteExercise = async () => {
    if (!exerciseToDelete) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8800/api/aclRehab/exercises/${exerciseToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }

      setExercises(
        exercises.filter((exercise) => exercise._id !== exerciseToDelete)
      );
      toast.success("Exercise deleted successfully!");
    } catch (error) {
      toast.error("Error deleting exercise.");
      console.error("Error:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div>
      {openAlert && (
        <div className="fixed top-0 left-0 right-0 bg-white border border-gray-200 shadow-lg p-4 text-center mx-auto max-w-xl z-50 animate-slide-down rounded-lg">
          <FaCheckCircle className="w-8 h-8 text-green-500 inline-block mr-2" />
          <span className="text-lg font-semibold text-green-600">
            {alertMessage}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">
            ACL Rehab Exercises
          </h2>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-buttonColor text-white font-semibold hover:bg-darkBlue hover:text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={16} /> Submitting
                </>
              ) : (
                <>
                  <Upload size={16} />{" "}
                  {editExercise ? "Update Exercise" : "Upload New"}
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editExercise ? "Edit Exercise" : "Add New Exercise"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="overflow-y-auto max-h-[400px] px-2">
                <div className="outline-none mb-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newExercise.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="outline-none mb-4">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newExercise.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="outline-none mb-4">
                  <Label htmlFor="injuryType">Injury Type</Label>
                  <select
                    id="injuryType"
                    name="injuryType"
                    value={newExercise.injuryType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Injury Type</option>
                    <option value="Healthy">Healthy</option>
                    <option value="ACL Tear">ACL Tear</option>
                    <option value="Partial ACL Tear OR Partially Injured">
                      Partial ACL Tear OR Partially Injured
                    </option>
                    <option value="Complete ACL Tear OR Completely Ruptured">
                      Complete ACL Tear OR Completely Ruptured
                    </option>
                  </select>
                </div>

                {/* Steps */}
                <div className="mb-4">
                  <Label>Steps</Label>
                  {newExercise.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Input
                        type="text"
                        value={step}
                        onChange={(e) => handleStepChange(e, index)}
                        placeholder={`Step ${index + 1}`}
                        className="w-full"
                      />
                      <Button
                        variant="outline"
                        type="button"
                        className="bg-red-500 text-white"
                        onClick={() =>
                          setNewExercise((prev) => ({
                            ...prev,
                            steps: prev.steps.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addNewStep}
                    className="bg-gray-500 text-white"
                  >
                    Add Step
                  </Button>
                </div>

                <div className="mb-4">
                  <Label htmlFor="imageSrc">Upload Image</Label>
                  <Input
                    id="imageSrc"
                    name="imageSrc"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-buttonColor text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={16} />{" "}
                      Submitting...
                    </>
                  ) : editExercise ? (
                    "Update Exercise"
                  ) : (
                    "Add Exercise"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading exercises...</div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12">
          No exercises available. Please add some exercises.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise._id}
              className="border rounded-lg shadow-md p-4 relative"
            >
              <Image
                src={exercise.imageSrc}
                alt={exercise.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
              <p className="text-gray-600 mb-4">{exercise.description}</p>
              <h4 className="font-semibold mb-2">Steps:</h4>
              <ul className="list-decimal pl-5 space-y-2">
                {exercise.steps && exercise.steps.length > 0 ? (
                  exercise.steps.map((step, index) => (
                    <li key={index} className="text-gray-600">
                      {step}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">No steps available</li>
                )}
              </ul>

              <Menu as="div" className="absolute top-2 right-2">
                <Menu.Button>
                  <MoreHorizontal className="cursor-pointer" />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
                    <Menu.Item>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                        onClick={() => {
                          setEditExercise(exercise);
                          setNewExercise({
                            title: exercise.title,
                            description: exercise.description,
                            injuryType: exercise.injuryType,
                            steps: exercise.steps,
                            imageSrc: null,
                          });
                          setDialogOpen(true);
                        }}
                      >
                        <Edit size={16} /> Edit
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                        onClick={() => {
                          setExerciseToDelete(exercise._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this exercise?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmDeleteExercise}
              className="bg-red-500 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </DeleteDialog>
    </div>
  );
}
