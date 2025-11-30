### Task 13.1: Integrate Rich Text Editor for Event Descriptions
**Description**: Add rich text editing capability for event descriptions.

**Implementation Steps**:
- Install Tiptap editor: `npm install @tiptap/react @tiptap/starter-kit`
- Create `components/editor/RichTextEditor.tsx`:
  - Tiptap editor component
  - Toolbar with formatting options:
    - Bold, Italic, Underline
    - Headings (H1, H2, H3)
    - Bullet list, Numbered list
    - Blockquote
    - Code block
    - Link insertion
    - Image upload (Cloudinary)
  - Character count
  - Preview mode toggle
- Create `components/editor/EditorToolbar.tsx`:
  - Formatting buttons
  - Active state indicators
  - Keyboard shortcuts display
- Modify event creation form to use RichTextEditor
- Store HTML content in database
- Sanitize HTML on server side
- Display formatted content on event details page

**Editor Configuration**:
```typescript
// components/editor/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

export function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  return (
    <div className="border rounded-lg">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  )
}
```

**HTML Sanitization**:
```typescript
// lib/utils/sanitize-html.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'code', 'pre', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class']
  })
}
```

**Dependencies**: Task 4.2 (Event Creation Form)

**Files to Create**:
- `components/editor/RichTextEditor.tsx`
- `components/editor/EditorToolbar.tsx`
- `lib/utils/sanitize-html.ts`

**Files to Modify**:
- `components/events/create/EventDetailsStep.tsx` (use RichTextEditor)
- `app/events/[id]/page.tsx` (display formatted content)
- `app/api/v1/events/route.ts` (sanitize HTML before saving)

**Required Packages**:
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image isomorphic-dompurify
```

**Testing**:
- [ ] Editor displays correctly
- [ ] Formatting buttons work
- [ ] Content saves as HTML
- [ ] HTML is sanitized
- [ ] Formatted content displays on event page
- [ ] Image upload works
- [ ] Links are clickable
