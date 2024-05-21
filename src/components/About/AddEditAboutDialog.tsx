import { CreateAboutSchema, createAboutSchema } from "@/lib/validation/about";
import { zodResolver } from "@hookform/resolvers/zod";
import { About } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import LoadingButton from "../ui/loading-button";
import { Textarea } from "../ui/textarea";

interface AddEditAboutDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  aboutToEdit?: About;
}

export default function AddEditAboutDialog({
  open,
  setOpen,
  aboutToEdit,
}: AddEditAboutDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateAboutSchema>({
    resolver: zodResolver(createAboutSchema),
    defaultValues: {
      content: aboutToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateAboutSchema) {
    try {
      if (aboutToEdit) {
        const response = await fetch("/api/abouts", {
          method: "PATCH",
          body: JSON.stringify({
            id: aboutToEdit.id,
            ...input,
          }),
        });

        if (!response.ok) {
          throw Error(`Status code: ${response.status}`);
        }
      } else {
        const response = await fetch("/api/abouts", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw Error(`Status code: ${response.status}`);
        }

        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert(`Something went wrong. ${(error as Error).message}`);
    }
  }

  async function deleteAbout() {
    if (!aboutToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/abouts", {
        method: "DELETE",
        body: JSON.stringify({
          id: aboutToEdit.id,
        }),
      });
      if (!response.ok) {
        throw Error(`Status code: ${response.status}`);
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert(`Something went wrong. ${(error as Error).message}`);
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{aboutToEdit ? "Edit About" : "Add About"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="About content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              {aboutToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteAbout}
                  type="button"
                >
                  Delete about
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
