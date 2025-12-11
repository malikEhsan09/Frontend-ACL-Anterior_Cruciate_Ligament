"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation"; // Import useParams for dynamic route handling
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExerciseFormData {
  title: string;
  partiallyDamages: FileList;
}

export default function EditExercise() {
  const { exerciseId } = useParams(); // Get exerciseId from URL
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormData>();

  useEffect(() => {
    fetchExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExercise = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `http://localhost:8800/api/exercise/${exerciseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setValue("title", data.title); // Pre-fill form fields with exercise data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exercise:", error);
    }
  };

  const onSubmit = async (data: ExerciseFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);

    // Append other files if any
    for (let i = 0; i < data.partiallyDamages.length; i++) {
      formData.append("partiallyDamages", data.partiallyDamages[i]);
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8800/api/exercise/update/${exerciseId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        router.push("/admin/exercises");
      } else {
        console.error("Failed to update exercise");
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Edit Exercise</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input {...register("title", { required: true })} />
          {errors.title && <p className="text-red-600">Title is required</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="partiallyDamages">Partially Damaged Videos</Label>
          <Input type="file" {...register("partiallyDamages")} multiple />
        </div>

        <Button type="submit" className="mt-4">
          Update Exercise
        </Button>
      </form>
    </div>
  );
}
