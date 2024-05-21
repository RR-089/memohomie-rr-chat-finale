"use client";

import { About as AboutModel } from "@prisma/client";
import { useState } from "react";
import AddEditAboutDialog from "./AddEditAboutDialog";
import { Card, CardContent } from "../ui/card";

interface AboutProps {
  about: AboutModel;
}

export default function About({ about }: AboutProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer shadow shadow-violet-400 transition-shadow hover:shadow-2xl hover:shadow-violet-600"
        onClick={() => setShowEditDialog(true)}
      >
        <CardContent>
          <p className="overflow-auto whitespace-pre-line pt-5">
            {about.content}
          </p>
        </CardContent>
      </Card>
      <AddEditAboutDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        aboutToEdit={about}
      />
    </>
  );
}
