```sql
-- Improved analysis_works table with tagged_by and separate ratings system
CREATE TABLE analysis_works (
  analysis_work_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL,
  tagged_by UUID, -- User who performed the analysis/tagging
  progress DECIMAL(5,2) CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(20) NOT NULL CHECK (status IN ('rejected', 'review', 'completed', 'approved')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE,
  FOREIGN KEY (tagged_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Separate table for multiple ratings by different users
CREATE TABLE analysis_ratings (
  rating_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_work_id UUID NOT NULL,
  rated_by UUID NOT NULL, -- User who provided the rating
  rating DECIMAL(5,2) NOT NULL CHECK (rating >= 0 AND rating <= 100),
  rating_notes TEXT, -- Optional comments for the specific rating
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (analysis_work_id) REFERENCES analysis_works(analysis_work_id) ON DELETE CASCADE,
  FOREIGN KEY (rated_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(analysis_work_id, rated_by) -- Prevent duplicate ratings from same user
);


```
