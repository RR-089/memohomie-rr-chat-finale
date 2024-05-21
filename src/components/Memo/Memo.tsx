"use client";

import { Memo as MemoModel } from "@prisma/client";
import { useState } from "react";
import AddEditmemoDialog from "./AddEditMemoDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface MemoProps {
  memo: MemoModel;
}

export default function Memo({ memo }: MemoProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const wasUpdated = memo.updatedAt > memo.createdAt;

  const createdUpdatedAtTimestamp = (
    wasUpdated ? memo.updatedAt : memo.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer shadow shadow-violet-400 transition-shadow hover:shadow-2xl hover:shadow-violet-600"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{memo.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="overflow-auto whitespace-pre-line">{memo.content}</p>
        </CardContent>
      </Card>
      <AddEditmemoDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        memoToEdit={memo}
      />
    </>
  );
}
