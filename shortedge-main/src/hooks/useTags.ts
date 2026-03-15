import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
}

export function useTags() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [linkTagMap, setLinkTagMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("tags")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name");
    setTags((data as Tag[]) || []);
  }, [user]);

  const fetchLinkTags = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("link_tags")
      .select("link_id, tag_id")
      .eq("user_id", user.id);
    
    const map: Record<string, string[]> = {};
    (data || []).forEach((row: any) => {
      if (!map[row.link_id]) map[row.link_id] = [];
      map[row.link_id].push(row.tag_id);
    });
    setLinkTagMap(map);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([fetchTags(), fetchLinkTags()]).finally(() => setLoading(false));
  }, [user, fetchTags, fetchLinkTags]);

  const createTag = useCallback(async (name: string): Promise<Tag | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("tags")
      .insert({ user_id: user.id, name: name.trim().toLowerCase() })
      .select("id, name")
      .single();
    if (error) {
      if (error.code === "23505") {
        // Already exists, fetch it
        const { data: existing } = await supabase
          .from("tags")
          .select("id, name")
          .eq("user_id", user.id)
          .eq("name", name.trim().toLowerCase())
          .single();
        return existing as Tag | null;
      }
      toast.error("Failed to create tag");
      return null;
    }
    setTags((prev) => [...prev, data as Tag].sort((a, b) => a.name.localeCompare(b.name)));
    return data as Tag;
  }, [user]);

  const deleteTag = useCallback(async (tagId: string) => {
    await supabase.from("tags").delete().eq("id", tagId);
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    setLinkTagMap((prev) => {
      const next = { ...prev };
      for (const linkId in next) {
        next[linkId] = next[linkId].filter((id) => id !== tagId);
      }
      return next;
    });
  }, []);

  const addTagToLink = useCallback(async (linkId: string, tagId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("link_tags")
      .insert({ user_id: user.id, link_id: linkId, tag_id: tagId });
    if (error && error.code !== "23505") {
      toast.error("Failed to add tag");
      return;
    }
    setLinkTagMap((prev) => ({
      ...prev,
      [linkId]: [...new Set([...(prev[linkId] || []), tagId])],
    }));
  }, [user]);

  const removeTagFromLink = useCallback(async (linkId: string, tagId: string) => {
    await supabase
      .from("link_tags")
      .delete()
      .eq("link_id", linkId)
      .eq("tag_id", tagId);
    setLinkTagMap((prev) => ({
      ...prev,
      [linkId]: (prev[linkId] || []).filter((id) => id !== tagId),
    }));
  }, []);

  const getTagNames = useCallback((linkId: string): string[] => {
    const tagIds = linkTagMap[linkId] || [];
    return tagIds.map((id) => tags.find((t) => t.id === id)?.name).filter(Boolean) as string[];
  }, [linkTagMap, tags]);

  const getTagId = useCallback((name: string): string | undefined => {
    return tags.find((t) => t.name === name)?.id;
  }, [tags]);

  return {
    tags,
    linkTagMap,
    loading,
    createTag,
    deleteTag,
    addTagToLink,
    removeTagFromLink,
    getTagNames,
    getTagId,
    allTagNames: tags.map((t) => t.name),
  };
}
