export const RESOURCE_CONFIG = {
  notices: {
    label: 'Amatangazo',
    path: '/notices',
    titleField: 'title',
    description: 'Church announcements (daily, weekly, monthly, urgent) — separate from news and events',
    fields: [
      { key: 'title', rw: true, label: 'Title', type: 'text', required: true },
      { key: 'body', rw: true, label: 'Announcement text', type: 'textarea', required: true },
      {
        key: 'category',
        label: 'Type',
        type: 'select',
        options: ['weekly', 'daily', 'monthly', 'urgent'],
        optionLabels: { weekly: 'Weekly / Ry’icyumweru', daily: 'Daily / Ry’umunsi', monthly: 'Monthly / Ry’ukwezi', urgent: 'Urgent / Byihutirwa' },
      },
      { key: 'publishDate', label: 'Publish date', type: 'datetime', required: true },
      { key: 'expiresAt', label: 'Hide after (optional)', type: 'datetime' },
      { key: 'pinned', label: 'Pin to top', type: 'boolean' },
      { key: 'attachmentUrl', label: 'Attachment (PDF or image, optional)', type: 'image' },
    ],
  },
  events: {
    label: 'Events',
    path: '/events',
    titleField: 'title',
    description: 'Upcoming church events',
    fields: [
      { key: 'title', rw: true, label: 'Title', type: 'text', required: true },
      { key: 'description', rw: true, label: 'Description', type: 'textarea', required: true },
      { key: 'date', label: 'Date', type: 'datetime', required: true },
      { key: 'time', rw: true, label: 'Time / schedule', type: 'text', required: true },
      { key: 'location', rw: true, label: 'Location', type: 'text' },
      { key: 'imageUrl', label: 'Image', type: 'image' },
    ],
  },
  announcements: {
    label: 'News',
    path: '/announcements',
    titleField: 'title',
    description: 'News stories (Amakuru) — for weekly church communication use Amatangazo',
    fields: [
      { key: 'title', rw: true, label: 'Title', type: 'text', required: true },
      { key: 'content', rw: true, label: 'Content', type: 'textarea', required: true },
      { key: 'date', label: 'Date', type: 'datetime', required: true },
      { key: 'imageUrl', label: 'Image', type: 'image' },
    ],
  },
  ministries: {
    label: 'Ministries',
    path: '/ministries',
    titleField: 'name',
    description: 'Ministry pages and home cards',
    fields: [
      { key: 'name', rw: true, label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
      {
        key: 'category',
        label: 'Department (menu column)',
        type: 'select',
        options: ['evangelism', 'social', 'development', 'education'],
        optionLabels: {
          evangelism: 'Ivugabutumwa / Evangelism',
          social: 'Imibereho myiza / Social welfare',
          development: 'Iterambere / Development',
          education: 'Uburezi / Education',
        },
      },
      { key: 'shortDescription', rw: true, label: 'Short description', type: 'textarea', required: true },
      { key: 'body', rw: true, label: 'Full body', type: 'textarea', required: true },
      { key: 'heroImageUrl', label: 'Hero image', type: 'image' },
      { key: 'aboutImageUrl', label: 'About image', type: 'image' },
      { key: 'scheduleLabel', rw: true, label: 'Schedule note', type: 'text' },
      { key: 'youtubeUrl', label: 'YouTube URL', type: 'text' },
      { key: 'featuredOnHome', label: 'Featured on home', type: 'boolean' },
      { key: 'homeOrder', label: 'Home order', type: 'number' },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  people: {
    label: 'Leadership',
    path: '/people',
    titleField: 'name',
    description: 'Pastoral & leadership team',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'position', rw: true, label: 'Position', type: 'text' },
      { key: 'team', label: 'Team', type: 'select', options: ['NATIONAL', 'PARISH', 'OTHER'] },
      { key: 'imageUrl', label: 'Photo', type: 'image' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  gallery: {
    label: 'Gallery',
    path: '/gallery',
    titleField: 'caption',
    description: 'Photo gallery items',
    fields: [
      { key: 'imageUrl', label: 'Image', type: 'image', required: true },
      { key: 'alt', rw: true, label: 'Alt text', type: 'text' },
      { key: 'caption', rw: true, label: 'Caption', type: 'text' },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  testimonials: {
    label: 'Testimonials',
    path: '/testimonials',
    titleField: 'author',
    description: 'Shown on the home page only when enabled in Site settings',
    fields: [
      { key: 'author', label: 'Author', type: 'text', required: true },
      { key: 'role', rw: true, label: 'Role', type: 'text' },
      { key: 'text', rw: true, label: 'Quote', type: 'textarea', required: true },
      { key: 'imageUrl', label: 'Photo', type: 'image' },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  stats: {
    label: 'Stats',
    path: '/stats',
    titleField: 'label',
    description: 'Homepage statistics',
    fields: [
      { key: 'number', label: 'Number', type: 'text', required: true },
      { key: 'label', rw: true, label: 'Label', type: 'text', required: true },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  giving: {
    label: 'Giving accounts',
    path: '/giving',
    titleField: 'purposeName',
    description: 'The Donate page shows the FIRST published account (lowest sort order)',
    fields: [
      { key: 'purposeKey', label: 'Purpose key', type: 'text', required: true },
      { key: 'purposeName', rw: true, label: 'Purpose name', type: 'text', required: true },
      { key: 'mtnNumber', label: 'MTN number', type: 'text' },
      { key: 'airtelNumber', label: 'Airtel number', type: 'text' },
      { key: 'mobileName', label: 'Mobile account name', type: 'text' },
      { key: 'bankName', label: 'Bank name', type: 'text' },
      { key: 'accountName', label: 'Bank account name', type: 'text' },
      { key: 'accountNumber', label: 'Account number', type: 'text' },
      { key: 'swift', label: 'SWIFT', type: 'text' },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  services: {
    label: 'Services / Sermons',
    path: '/services',
    titleField: 'serviceTitle',
    description: 'Service and sermon listings',
    fields: [
      { key: 'serviceTitle', label: 'Service title', type: 'text', required: true },
      { key: 'topic', label: 'Topic', type: 'text', required: true },
      { key: 'preacherName', label: 'Preacher', type: 'text', required: true },
      { key: 'verse', label: 'Verse', type: 'text', required: true },
      { key: 'date', label: 'Date', type: 'datetime', required: true },
      { key: 'imageUrl', label: 'Image', type: 'image' },
    ],
  },
};

export function toInputValue(field, value) {
  if (field.type === 'datetime' && value) {
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'number') return value ?? 0;
  return value ?? '';
}

export function fromInputValue(field, value) {
  if (field.type === 'datetime') {
    if (!value && !field.required) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'number') return Number(value || 0);
  if (value === '' || value === undefined) return null;
  return value;
}
