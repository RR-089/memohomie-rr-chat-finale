import { CreateMemoSchema, createMemoSchema } from "@/lib/validation/memo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Memo } from "@prisma/client";
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
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";
import { Textarea } from "../ui/textarea";

interface AddEditMemoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  memoToEdit?: Memo;
}

export default function AddEditMemoDialog({
  open,
  setOpen,
  memoToEdit,
}: AddEditMemoDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateMemoSchema>({
    resolver: zodResolver(createMemoSchema),
    defaultValues: {
      title: memoToEdit?.title || "",
      content: memoToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateMemoSchema) {
    try {
      if (memoToEdit) {
        const response = await fetch("/api/memos", {
          method: "PATCH",
          body: JSON.stringify({
            id: memoToEdit.id,
            ...input,
          }),
        });

        if (!response.ok) {
          throw Error(`Status code: ${response.status}`);
        }
      } else {
        const response = await fetch("/api/memos", {
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

  async function deleteMemo() {
    if (!memoToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/memos", {
        method: "DELETE",
        body: JSON.stringify({
          id: memoToEdit.id,
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
          <DialogTitle>{memoToEdit ? "Edit Memo" : "Add Memo"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memo title</FormLabel>
                  <FormControl>
                    <Input placeholder="Memo title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memo content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Memo content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              {memoToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteMemo}
                  type="button"
                >
                  Delete memo
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
