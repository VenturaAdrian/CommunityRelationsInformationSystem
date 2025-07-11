USE [comrel_master]
GO

/****** Object:  Table [dbo].[upload_master]    Script Date: 7/11/2025 9:09:14 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[upload_master](
	[upload_id] [int] IDENTITY(1,1) NOT NULL,
	[request_id] [varchar](100) NOT NULL,
	[upload_type] [varchar](100) NOT NULL,
	[file_name] [varchar](255) NOT NULL,
	[file_path] [varchar](500) NOT NULL,
	[upload_by] [varchar](100) NOT NULL,
	[upload_date] [varchar](100) NOT NULL,
	[updated_by] [varchar](100) NOT NULL,
	[updated_at] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[upload_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


