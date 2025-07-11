USE [comrel_master]
GO

/****** Object:  Table [dbo].[users_master]    Script Date: 7/11/2025 9:10:19 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users_master](
	[id_master] [int] IDENTITY(1,1) NOT NULL,
	[emp_firstname] [nvarchar](100) NOT NULL,
	[emp_lastname] [nvarchar](100) NOT NULL,
	[user_name] [nvarchar](100) NOT NULL,
	[emp_position] [nvarchar](100) NULL,
	[pass_word] [nvarchar](255) NOT NULL,
	[emp_role] [nvarchar](50) NULL,
	[emp_email] [nvarchar](50) NULL,
	[created_by] [nvarchar](100) NULL,
	[created_at] [datetime] NULL,
	[updated_by] [nvarchar](100) NULL,
	[updated_at] [datetime] NULL,
	[is_active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_master] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[user_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[users_master] ADD  DEFAULT (getdate()) FOR [created_at]
GO

ALTER TABLE [dbo].[users_master] ADD  DEFAULT (getdate()) FOR [updated_at]
GO

ALTER TABLE [dbo].[users_master] ADD  DEFAULT ((1)) FOR [is_active]
GO


