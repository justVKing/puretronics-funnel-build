export type AnalyticsEventName =
  | 'capability_explorer_started'
  | 'explorer_start_mode_selected'
  | 'problem_selected'
  | 'stage_selected'
  | 'family_selected'
  | 'product_search_used'
  | 'navigator_results_viewed'
  | 'product_detail_opened'
  | 'comparison_item_added'
  | 'comparison_viewed'
  | 'readiness_builder_started'
  | 'readiness_brief_generated'
  | 'readiness_brief_copied'
  | 'readiness_brief_printed'
  | 'application_review_cta_clicked'
  | 'service_support_cta_clicked'
  | 'technical_resource_opened'
  | 'no_result_state_seen';

export interface AnalyticsPayload {
  location?: string;
  mode?: string;
  ids?: string[];
  count?: number;
  device?: 'mobile' | 'tablet' | 'desktop';
}
