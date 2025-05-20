export interface Document {
  id: string;
  requirement_id: string;
  holding_id: string;
  status: string;
  uploaded_by_id: string;
  uploaded_at: string;
  validated_at?: string;
  file_path: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  content_type: string;
  rejection_reason?: string;
}
