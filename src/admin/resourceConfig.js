export const RESOURCE_CONFIG = {
  events: {
    label: 'Events',
    path: '/events',
    titleField: 'title',
    description: 'Upcoming church events',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'date', label: 'Date', type: 'datetime', required: true },
      { key: 'time', label: 'Time / schedule', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'imageUrl', label: 'Image', type: 'image' },
    ],
  },
  announcements: {
    label: 'News',
    path: '/announcements',
    titleField: 'title',
    description: 'News & announcements',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'content', label: 'Content', type: 'textarea', required: true },
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
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'shortDescription', label: 'Short description', type: 'textarea', required: true },
      { key: 'body', label: 'Full body', type: 'textarea', required: true },
      { key: 'heroImageUrl', label: 'Hero image', type: 'image' },
      { key: 'aboutImageUrl', label: 'About image', type: 'image' },
      { key: 'scheduleLabel', label: 'Schedule note', type: 'text' },
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
      { key: 'position', label: 'Position', type: 'text' },
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
      { key: 'alt', label: 'Alt text', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  testimonials: {
    label: 'Testimonials',
    path: '/testimonials',
    titleField: 'author',
    description: 'Member testimonials',
    fields: [
      { key: 'author', label: 'Author', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'text', label: 'Quote', type: 'textarea', required: true },
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
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'sortOrder', label: 'Sort order', type: 'number' },
    ],
  },
  giving: {
    label: 'Giving accounts',
    path: '/giving',
    titleField: 'purposeName',
    description: 'Mobile money & bank details',
    fields: [
      { key: 'purposeKey', label: 'Purpose key', type: 'text', required: true },
      { key: 'purposeName', label: 'Purpose name', type: 'text', required: true },
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
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'number') return Number(value || 0);
  if (value === '' || value === undefined) return null;
  return value;
}
