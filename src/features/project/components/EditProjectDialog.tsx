import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectApi } from "../project.api";
import { toast } from "sonner";
import { Project } from "../project.types";

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh projects list
  project: Project | null; // The project data to edit
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project,
}) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setThumbnail(project.thumbnail || "");
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!project) return;

    try {
      await projectApi.updateProject(project.id, {
        name,
        description,
        thumbnail,
      });
      toast.success(`Project \"${name}\" updated successfully.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update project.");
      toast.error(err.message || "Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thumbnail" className="text-right">
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center col-span-4">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
