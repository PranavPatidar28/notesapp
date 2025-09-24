"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { ApiError, createNote, deleteNote as apiDelete, listNotes, updateNote, upgradeTenant } from "@/lib/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Note = { id: string; title: string; content: string; createdAt: string };
type User = { role?: string; tenant?: { slug?: string } };

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [upgradeNeeded, setUpgradeNeeded] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const isAdmin = user?.role === "ADMIN";
  const tenantSlug = user?.tenant?.slug;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const rawUser = localStorage.getItem("user");
      setUser(rawUser ? JSON.parse(rawUser) : null);
    } catch {
      setUser(null);
    }
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await listNotes();
      setNotes(res.notes);
    } catch (e: unknown) {
      const err = e as ApiError;
      if (err.status === 401) router.replace("/login");
      else setError(err?.error || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);
      if (!title.trim()) return;
      if (editingId) {
        const res = await updateNote(editingId, { title, content });
        setNotes((prev) => prev.map((n) => (n.id === editingId ? res.note : n)));
        setEditingId(null);
      } else {
        const res = await createNote({ title, content });
        setNotes((prev) => [res.note, ...prev]);
      }
      resetForm();
    } catch (e: unknown) {
      const err = e as ApiError;
      if (err.status === 402) {
        setUpgradeNeeded(true);
      } else setError(err?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  async function remove(id: string) {
    setError(null);
    try {
      setDeleting(true);
      await apiDelete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e: unknown) {
      const err = e as ApiError;
      setError(err?.error || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  async function upgrade() {
    setError(null);
    try {
      if (!tenantSlug) {
        setError("No tenant");
        return;
      }
      await upgradeTenant(tenantSlug);
      setUpgradeNeeded(false);
    } catch (e: unknown) {
      const err = e as ApiError;
      setError(err?.error || "Upgrade failed");
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0b0b0b 0%, #121212 100%)" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Notes</h1>
          {isAdmin && (
            <Button variant="default" onClick={upgrade}>Upgrade Plan</Button>
          )}
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Card>
          <CardHeader>
            <div className="font-medium">{editingId ? "Edit Note" : "Create Note"}</div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3">
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="h-28" />
              <div className="flex gap-2">
                <Button type="submit" isLoading={saving} disabled={saving || !title.trim()}>
                  {editingId ? "Save Changes" : "Add Note"}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </form>
          </CardContent>
          {upgradeNeeded && (
            <CardFooter>
              <div className="w-full flex items-center justify-between bg-yellow-50 text-yellow-900 p-3 rounded">
                <div>Free plan limit reached (3 notes). Upgrade to Pro for unlimited notes.</div>
                {isAdmin ? (
                  <Button variant="outline" onClick={upgrade}>Upgrade to Pro</Button>
                ) : (
                  <span className="text-sm">Ask an admin to upgrade</span>
                )}
              </div>
            </CardFooter>
          )}
        </Card>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-5 w-40 bg-[#1a1a1a] rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-[#1a1a1a] rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-[#1a1a1a] rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-[#1a1a1a] rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {notes.length === 0 ? (
              <div className="text-sm text-[#cfcfcf]">No notes yet. Create your first note above.</div>
            ) : (
              notes.map((n) => (
                <Card key={n.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{n.title}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => startEdit(n)}>Edit</Button>
                        <Button variant="destructive" onClick={() => { setPendingDeleteId(n.id); }}>Delete</Button>
                      </div>
                    </div>
                  </CardHeader>
                  {n.content && <CardContent><div className="text-sm text-neutral-700 whitespace-pre-wrap">{n.content}</div></CardContent>}
                </Card>
              ))
            )}
          </div>
        )}

        <ConfirmDialog
          open={pendingDeleteId !== null}
          title="Delete note?"
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleting}
          onCancel={() => { setPendingDeleteId(null); }}
          onConfirm={async () => {
            if (pendingDeleteId) await remove(pendingDeleteId);
            setPendingDeleteId(null);
          }}
        />
      </div>
    </div>
  );
}



