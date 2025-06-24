export interface Icon {
  _id: string;
  name: string;
  url: string;
  color: string;
  tags: string[];
  type: 'account' | 'category';
}
