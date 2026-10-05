export const DAY_OPTIONS = ['1', '2', '3', '4', '5', '6', '0'];
export const DAY_LABELS = {
  0: 'Sunday / Ku Cyumweru',
  1: 'Monday / Ku wa Mbere',
  2: 'Tuesday / Ku wa Kabiri',
  3: 'Wednesday / Ku wa Gatatu',
  4: 'Thursday / Ku wa Kane',
  5: 'Friday / Ku wa Gatanu',
  6: 'Saturday / Ku wa Gatandatu',
};

export const RESOURCE_CONFIG = {
  schedule: {
    label: 'Weekly programme',
    path: '/schedule',
    noMedia: true,
    titleField: 'title',
    description:
      'Recurring activities shown on the Amatangazo page: services, prayer, choir practice, meetings… (use Events for one-off dates)',
    subtitle: (item) => {
      const days = item.days || [];
      const dayText =
        days.length === 7
          ? 'Every day'
          : days.join(',') === '1,2,3,4,5,6'
            ? 'Monday to Saturday'
            : days.map((d) => DAY_LABELS[d]?.split(' / ')[0]).join(', ');
      const often = item.recurrence && item.recurrence !== 'every' ? ` · ${item.recurrence} week of month` : '';
      return `${dayText} · ${item.startTime}${item.endTime ? ` to ${item.endTime}` : ''}${often} · ${item.category}`;
    },
    fields: [
      { key: 'title', rw: true, label: 'Activity name', type: 'text', required: true },
      {
        key: 'category',
        label: 'Type',
        type: 'select',
        options: ['service', 'prayer', 'choir', 'fellowship', 'youth', 'children', 'meeting', 'other'],
        optionLabels: {
          service: 'Service / Amateraniro',
          prayer: 'Prayer / Amasengesho',
          choir: 'Choir practice / Imyitozo ya korali',
          fellowship: 'Fellowship / Gusabana',
          youth: 'Youth / Urubyiruko',
          children: 'Children / Abana',
          meeting: 'Meeting / Inama',
          other: 'Other / Ibindi',
        },
      },
      { key: 'days', label: 'Days', type: 'days', required: true },
      {
        key: 'recurrence',
        label: 'How often',
        type: 'select',
        options: ['every', 'first', 'second', 'third', 'fourth', 'last'],
        optionLabels: {
          every: 'Every week',
          first: '1st week of the month',
          second: '2nd week of the month',
          third: '3rd week of the month',
          fourth: '4th week of the month',
          last: 'Last week of the month',
        },
      },
      { key: 'startTime', label: 'Starts', type: 'time', required: true },
      { key: 'endTime', label: 'Ends (optional)', type: 'time' },
      { key: 'location', rw: true, label: 'Place', type: 'text' },
      { key: 'leader', label: 'Led by (optional)', type: 'text' },
      {
        key: 'ministrySlug',
        label: 'Also show on ministry page (optional)',
        type: 'select',
        optionsFrom: '/ministries',
      },
      { key: 'notes', rw: true, label: 'Notes (optional)', type: 'textarea' },
      { key: 'sortOrder', label: 'Order (same day & time)', type: 'number' },
    ],
  },
  notices: {
    label: 'Amatangazo',
    path: '/notices',
    noMedia: true,
    titleField: 'title',
    description: 'Church announcements (daily, weekly, monthly, urgent), separate from news and events',
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
    description: 'News stories (Amakuru). For weekly church communication use Amatangazo',
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
    description: 'Donation purposes and their Mobile Money / bank accounts shown on the Donate page',
    fields: [
      { key: 'purposeKey', label: 'Purpose key', type: 'text', required: true },
      { key: 'purposeName', rw: true, label: 'Purpose name', type: 'text', required: true },
      { key: 'momoCode', label: 'MTN MoMo Pay code (e.g. 006361)', type: 'text' },
      { key: 'mtnNumber', label: 'MTN number (optional)', type: 'text' },
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
  if (field.type === 'days') return Array.isArray(value) ? value : [];
  if (field.numeric) return value === null || value === undefined ? field.options?.[0] ?? '' : String(value);
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
  if (field.type === 'days') return (value || []).map(Number);
  if (field.optionsFrom) return value || null;
  if (field.type === 'datetime') {
    if (!value && !field.required) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'number' || field.numeric) return Number(value || 0);
  if (value === '' || value === undefined) return null;
  return value;
}
