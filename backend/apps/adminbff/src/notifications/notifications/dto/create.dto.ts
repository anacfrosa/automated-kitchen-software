// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
// import { IsArray, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
// import { IsDateString } from 'class-validator';

// export class ForecastDto {
//   @ApiPropertyOptional({
//     description: 'Unique identifier for the forecast',
//   })
//   @IsUUID()
//   @IsOptional()
//   id?: string;

//   @ApiPropertyOptional({
//     description: 'Unique identifier for the shop',
//   })
//   @IsUUID()
//   @IsOptional()
//   shopId?: string;

//   @ApiProperty({
//     description: 'Unique identifier for the ingredient',
//   })
//   @IsUUID()
//   ingredientId: string;

//   @ApiProperty({
//     description: 'The date in YYYY-MM-DD format',
//     example: '2024-07-25',
//   })
//   @IsDateString() // Validates that the value is a valid ISO date string
//   date: string; // Use 'string' for ISO 8601 date strings

//   @ApiProperty({
//     description: 'Quantity of the ingredient forecasted',
//     example: 25,
//   })
//   @IsNumber()
//   quantity: number;

//   @ApiProperty({
//     description: 'Measurement unit for the ingredient quantity',
//     enum: StandardMeasureUnit, // Swagger will generate an enum dropdown
//   })
//   @IsEnum(StandardMeasureUnit)
//   measureUnit: StandardMeasureUnit; // Should be of the same type as the enum
// }

// export class CreateForecastsDto {
//   @ApiProperty({
//     type: [ForecastDto], // Specifies that this is an array of CreateForecastDto
//     description: 'List of ingredient forecasts',
//   })
//   @IsArray()
//   ingredientForecasts: ForecastDto[];
// }
