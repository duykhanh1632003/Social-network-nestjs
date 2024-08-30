import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { dataSourceOptions } from "./database.providers";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    public createTypeOrmOptions():TypeOrmModuleOptions  {
        return dataSourceOptions
    }
}